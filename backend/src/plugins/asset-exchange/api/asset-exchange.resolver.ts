import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { 
    RequestContext, 
    Ctx, 
    Transaction, 
    TransactionalConnection, 
    Customer,
    UserInputError,
    Allow,
    Permission
} from '@vendure/core';
import { TopUpRequest } from '../entities/top-up-request.entity';
import { WithdrawalRequest } from '../entities/withdrawal-request.entity';

@Resolver()
export class AssetExchangeResolver {
    constructor(
        private connection: TransactionalConnection,
    ) {}

    // ==========================================================
    // TOP UP (User Requests to add Cash)
    // ==========================================================
    @Mutation()
    @Transaction()
    @Allow(Permission.Owner) // Only logged-in customer
    async requestTopUp(
        @Ctx() ctx: RequestContext,
        @Args('amount') amount: number,
        @Args('proofImage') proofImage: string
    ) {
        if (amount <= 0) throw new UserInputError('Amount must be positive');
        
        const userId = ctx.activeUserId;
        if (!userId) throw new UserInputError('Not authorized');

        const customer = await this.connection.getRepository(ctx, Customer).findOne({
            where: { user: { id: userId } }
        });

        if (!customer) throw new UserInputError('Customer not found');

        const request = new TopUpRequest({
            amount,
            proofImage,
            customer,
            status: 'Pending'
        });

        return await this.connection.getRepository(ctx, TopUpRequest).save(request);
    }

    // ==========================================================
    // WITHDRAWAL (User Requests to cash out Points)
    // ==========================================================
    @Mutation()
    @Transaction()
    @Allow(Permission.Owner)
    async requestWithdrawal(
        @Ctx() ctx: RequestContext,
        @Args('pointsToWithdraw') pointsToWithdraw: number,
        @Args('paymentDetails') paymentDetails: any // JSON Input
    ) {
        const userId = ctx.activeUserId;
        if (!userId) throw new UserInputError('Not authorized');

        // 1. Validate Tier Logic (Whitepaper Tiers)
        // 110 -> 10, 540 -> 50, 1060 -> 100, 5200 -> 500
        const tiers: Record<number, number> = {
            110: 10,
            540: 50,
            1060: 100,
            5200: 500
        };

        const cashValue = tiers[pointsToWithdraw];
        if (!cashValue) {
            throw new UserInputError(`Invalid withdrawal tier: ${pointsToWithdraw} points. Allowed: 110, 540, 1060, 5200.`);
        }

        // 2. Atomic Transaction (Deduct Points -> Create Request)
        return await this.connection.withTransaction(async (txCtx) => {
            const customerRepo = this.connection.getRepository(txCtx, Customer);
            
            // Lock Check (Optional, but findOne is safe enough here if isolation level is correct)
            const customer = await customerRepo.findOne({ 
                where: { user: { id: userId } }
            });

            if (!customer) throw new UserInputError('Customer not found');

            const currentPoints = (customer.customFields as any).pointBalance || 0;

            if (currentPoints < pointsToWithdraw) {
                throw new UserInputError(`Insufficient points. You have ${currentPoints}, need ${pointsToWithdraw}.`);
            }

            // A. Deduct Points immediately
            (customer.customFields as any).pointBalance = currentPoints - pointsToWithdraw;
            await customerRepo.save(customer);

            // B. Create Request Record with Snapshot
            const request = new WithdrawalRequest({
                customer,
                pointsDeducted: pointsToWithdraw,
                cashAmount: cashValue,
                paymentSnapshot: paymentDetails,
                status: 'Pending'
            });

            return await this.connection.getRepository(txCtx, WithdrawalRequest).save(request);
        });
    }
}