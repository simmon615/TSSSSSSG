import { Injectable } from '@nestjs/common';
import { 
    RequestContext, 
    TransactionalConnection, 
    Order, 
    Customer,
    ProductVariant
} from '@vendure/core';
import { Decimal } from 'decimal.js';
import { CommissionLog } from '../plugins/point-distribution/entities/commission-log.entity';

@Injectable()
export class PointDistributionService {
    constructor(private connection: TransactionalConnection) {}

    /**
     * Core Logic: Distribute points after order settlement
     * Algo: 50% Recursive Decay
     */
    async distributePointsForOrder(ctx: RequestContext, order: Order) {
        await this.connection.withTransaction(async (txCtx) => {
            
            // 1. Calculate Total Basis Points
            let totalBasisPoints = 0;
            for (const line of order.lines) {
                const variant = await this.connection.getEntityOrThrow(txCtx, ProductVariant, line.productVariant.id) as ProductVariant;
                const pointsPerUnit = (variant.customFields as any).rewardPoints || 0;
                totalBasisPoints += (pointsPerUnit * line.quantity);
            }

            if (totalBasisPoints <= 0) return;

            const buyer = await this.connection.getEntityOrThrow(txCtx, Customer, order.customer.id) as Customer;
            
            // 2. Recursive Distribution
            let currentBeneficiary: Customer | null = buyer;
            let remainingPoints = new Decimal(totalBasisPoints);
            let level = 0;

            // Stop if points < 1 or no beneficiary
            while (currentBeneficiary && remainingPoints.greaterThanOrEqualTo(1)) {
                
                // Rule: 50% of remaining (Floor to keep Integer)
                const allocatedPoints = remainingPoints.times(0.5).floor();

                if (allocatedPoints.lessThan(1)) break;

                // Update Point Balance
                const currentBalance = (currentBeneficiary.customFields as any).pointBalance || 0;
                (currentBeneficiary.customFields as any).pointBalance = currentBalance + allocatedPoints.toNumber();
                
                await this.connection.getRepository(txCtx, Customer).save(currentBeneficiary);

                // Log Commission
                await this.createCommissionLog(txCtx, {
                    amount: allocatedPoints.toNumber(),
                    beneficiaryId: currentBeneficiary.id.toString(),
                    sourceOrderId: order.id.toString(),
                    level: level,
                    status: 'Pending'
                });

                remainingPoints = remainingPoints.minus(allocatedPoints);
                
                // Move to Upline
                const referrer = (currentBeneficiary.customFields as any).referrer;
                if (referrer) {
                     currentBeneficiary = await this.connection.getRepository(txCtx, Customer).findOne({
                         where: { id: referrer.id }
                     });
                } else {
                    currentBeneficiary = null;
                }
                
                level++;
            }

            // 3. Pool remaining points to System Account (ID: 0)
            if (remainingPoints.greaterThan(0)) {
                // Ensure ID 0 handling logic is consistent with SystemAccountInitService
                // Note: We don't necessarily need to load the System Customer entity to log it, just the ID.
                await this.createCommissionLog(txCtx, {
                    amount: remainingPoints.toNumber(),
                    beneficiaryId: '0', 
                    sourceOrderId: order.id.toString(),
                    level: -1,
                    status: 'Settled'
                });
                
                // Optional: Actually increment System Account Point Balance if required for auditing
                // await this.incrementSystemBalance(txCtx, remainingPoints.toNumber());
            }
        });
    }

    private async createCommissionLog(txCtx: any, data: Partial<CommissionLog>) {
        const log = new CommissionLog(data);
        await this.connection.getRepository(txCtx, CommissionLog).save(log);
    }
}