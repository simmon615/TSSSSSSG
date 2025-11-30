import { VendureEntity, Customer } from '@vendure/core';
import { DeepPartial, Column, Entity, ManyToOne } from 'typeorm';

export type WithdrawalStatus = 'Pending' | 'Paid' | 'Rejected';

@Entity()
export class WithdrawalRequest extends VendureEntity {
    constructor(input?: DeepPartial<WithdrawalRequest>) {
        super(input);
    }

    @Column('int')
    pointsDeducted: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    cashAmount: number;

    @Column({ type: 'simple-json' })
    paymentSnapshot: any; // Stores bank name, account number, etc. at time of request

    @Column({ default: 'Pending' })
    status: WithdrawalStatus;

    @Column({ nullable: true })
    transactionReference: string; // For Admin to input bank ref ID

    @ManyToOne(type => Customer)
    customer: Customer;
}