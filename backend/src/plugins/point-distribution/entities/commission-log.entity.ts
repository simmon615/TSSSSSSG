import { VendureEntity } from '@vendure/core';
import { DeepPartial, Column, Entity, Index } from 'typeorm';

export type CommissionStatus = 'Pending' | 'Settled' | 'Cancelled';

@Entity()
export class CommissionLog extends VendureEntity {
    constructor(input?: DeepPartial<CommissionLog>) {
        super(input);
    }

    @Column('int')
    amount: number;

    @Column()
    @Index()
    beneficiaryId: string; // Storing as ID string (or '0' for System)

    @Column()
    @Index()
    sourceOrderId: string; // ID of the order that generated this commission

    @Column('int')
    level: number; // 0 = Buyer, 1 = Direct Upline, etc. -1 = System Pool

    @Column({ default: 'Pending' })
    status: CommissionStatus;
}