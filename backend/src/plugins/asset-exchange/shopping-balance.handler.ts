import { LanguageCode, PaymentMethodHandler, CreatePaymentResult, SettlePaymentResult, Injector, TransactionalConnection, Customer, UserInputError } from '@vendure/core';
import { Decimal } from 'decimal.js';

let connection: TransactionalConnection;

export const shoppingBalancePaymentHandler = new PaymentMethodHandler({
    code: 'shopping-balance-payment',
    description: [{ languageCode: LanguageCode.en, value: 'Pay with Shopping Balance' }],
    args: {},
    init(injector: Injector) {
        connection = injector.get(TransactionalConnection);
    },
    createPayment: async (ctx, order, amount, args): Promise<CreatePaymentResult> => {
        const customer = order.customer;
        if (!customer) {
            return {
                amount: order.total,
                state: 'Declined',
                errorMessage: 'Customer not found',
            };
        }

        // Use the injected connection to ensure we are working with the DB
        // Note: createPayment is not always inside the main transaction, so we should be careful.
        // However, for balance deduction, we treat it as an instant settlement.
        
        // 1. Refresh Customer Data to get latest balance
        const customerEntity = await connection.getRepository(ctx, Customer).findOne({
            where: { id: customer.id }
        });

        if (!customerEntity) {
             return { amount: order.total, state: 'Declined', errorMessage: 'Customer entity not found' };
        }

        // 2. Access Custom Fields
        const currentBalance = new Decimal((customerEntity.customFields as any).shoppingBalance || 0);
        // Vendure 'amount' is in cents (Integer). ShoppingBalance is in Units (Decimal/Float).
        const orderTotalUnits = new Decimal(amount).div(100);

        // 3. Check Balance
        if (currentBalance.lessThan(orderTotalUnits)) {
            return {
                amount: amount,
                state: 'Declined',
                errorMessage: `Insufficient Shopping Balance. Current: $${currentBalance.toFixed(2)}`,
            };
        }

        // 4. DEDUCT BALANCE (Critical Fix)
        // Since this is a "Wallet" payment, we treat authorization as immediate capture.
        const newBalance = currentBalance.minus(orderTotalUnits);
        (customerEntity.customFields as any).shoppingBalance = newBalance.toNumber();
        
        await connection.getRepository(ctx, Customer).save(customerEntity);

        return {
            amount: amount,
            state: 'Settled', // Mark as Settled immediately for wallet payments
            transactionId: `SP-${order.code}-${Date.now()}`,
            metadata: {
                originalBalance: currentBalance.toNumber(),
                newBalance: newBalance.toNumber(),
                deductedAmount: orderTotalUnits.toNumber()
            },
        };
    },
    settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
        // Since we returned 'Settled' in createPayment, this might be skipped or just confirmed.
        return { success: true };
    },
});