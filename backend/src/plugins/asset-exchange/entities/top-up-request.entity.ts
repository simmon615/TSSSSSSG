import { VendureEntity, Customer } from '@vendure/core';
import { DeepPartial, Column, Entity, ManyToOne } from 'typeorm';

export type TopUpStatus = 'Pending' | 'Approved' | 'Rejected';

@Entity()
export class TopUpRequest extends VendureEntity {
    constructor(input?: DeepPartial<TopUpRequest>) {
        super(input);
    }

    // 注意这里加了 !
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    amount!: number;

    @Column()
    proofImage!: string;

    @Column({ default: 'Pending' })
    status!: TopUpStatus;

    @Column({ nullable: true })
    rejectionReason!: string;

    @Column({ nullable: true })
    approvedAt!: Date;

    @ManyToOne(type => Customer)
    customer!: Customer;
}