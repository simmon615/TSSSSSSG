import { Injectable } from '@nestjs/common';
import { 
    RequestContext, 
    TransactionalConnection, 
    Customer, 
    UserInputError
} from '@vendure/core';
import { Decimal } from 'decimal.js';

@Injectable()
export class AssetExchangeService {
    constructor(private connection: TransactionalConnection) {}

    /**
     * Core Logic: Exchange Points to Shopping Balance
     * Rule: 10 Points = $1 Shopping Balance
     * Transaction: Atomic deduction of points and addition of balance.
     */
    async exchangePointsToShoppingBalance(ctx: RequestContext, pointsToExchange: number) {
        if (pointsToExchange <= 0 || !Number.isInteger(pointsToExchange)) {
            throw new UserInputError('Points to exchange must be a positive integer');
        }

        const userId = ctx.activeUserId;
        if (!userId) throw new UserInputError('User not logged in');

        return await this.connection.withTransaction(async (txCtx) => {
            const customerRepo = this.connection.getRepository(txCtx, Customer);
            
            const customer = await customerRepo.findOne({ 
                where: { user: { id: userId } },
                relations: ['user']
            });

            if (!customer) throw new UserInputError('Customer not found');

            // Access custom fields safely
            const currentPoints = (customer.customFields as any).pointBalance || 0;

            if (currentPoints < pointsToExchange) {
                throw new UserInputError(`Insufficient points. Current: ${currentPoints}, Required: ${pointsToExchange}`);
            }

            // Calculation: 10 Points = $1
            const exchangeRate = 10;
            const creditAmount = new Decimal(pointsToExchange).div(exchangeRate); 

            // Update Points (Integer)
            (customer.customFields as any).pointBalance = currentPoints - pointsToExchange;

            // Update Shopping Balance (Decimal)
            const currentShoppingBalance = new Decimal((customer.customFields as any).shoppingBalance || 0);
            const newShoppingBalance = currentShoppingBalance.plus(creditAmount);

            // Store as number (float) in DB, but calculated via Decimal
            (customer.customFields as any).shoppingBalance = newShoppingBalance.toNumber();

            await customerRepo.save(customer);

            return {
                success: true,
                newPointBalance: (customer.customFields as any).pointBalance,
                newShoppingBalance: (customer.customFields as any).shoppingBalance,
                exchangedAmount: creditAmount.toNumber()
            };
        });
    }

    /**
     * Approve Top-Up Request
     */
    async approveTopUpRequest(ctx: RequestContext, requestId: string | number) {
        return await this.connection.withTransaction(async (txCtx) => {
            // Assuming 'TopUpRequest' entity is registered
            const requestRepo = this.connection.getRepository(txCtx, 'TopUpRequest'); 
            const request = await requestRepo.findOne({ where: { id: requestId }, relations: ['customer'] });

            if (!request || request.status !== 'Pending') {
                throw new UserInputError('Invalid request or already processed');
            }

            const topUpAmount = new Decimal(request.amount);
            const customer = request.customer;
            
            // Update Main Balance
            const currentMainBalance = new Decimal((customer.customFields as any).mainBalance || 0);
            (customer.customFields as any).mainBalance = currentMainBalance.plus(topUpAmount).toNumber();

            request.status = 'Approved';
            request.approvedAt = new Date();

            await this.connection.getRepository(txCtx, Customer).save(customer);
            await requestRepo.save(request);

            return request;
        });
    }
}