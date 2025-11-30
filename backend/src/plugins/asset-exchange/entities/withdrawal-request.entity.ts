import { VendureEntity, Customer } from '@vendure/core';
import { DeepPartial, Column, Entity, ManyToOne } from 'typeorm';

export type WithdrawalStatus = 'Pending' | 'Paid' | 'Rejected';

@Entity()
export class WithdrawalRequest extends VendureEntity {
    constructor(input?: DeepPartial<WithdrawalRequest>) {
        super(input);
    }

    // 注意这里全加了 !
    @Column('int')
    pointsDeducted!: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    cashAmount!: number;

    @Column({ type: 'simple-json' })
    paymentSnapshot!: any;

    @Column({ default: 'Pending' })
    status!: WithdrawalStatus;

    @Column({ nullable: true })
    transactionReference!: string;

    @ManyToOne(type => Customer)
    customer!: Customer;
}