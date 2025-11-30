import { Entity, Column, ManyToOne } from 'typeorm';
import { VendureEntity, Customer, Order, DeepPartial } from '@vendure/core';

@Entity()
export class CommissionLog extends VendureEntity {
    constructor(input?: DeepPartial<CommissionLog>) {
        super(input);
    }

    // 注意这里全加了 !
    @Column('int')
    amount!: number;

    @Column({ default: 'Pending' })
    status!: string; 

    @Column()
    level!: number;

    @ManyToOne(() => Customer)
    beneficiary!: Customer;

    @ManyToOne(() => Order)
    sourceOrder!: Order;

    @ManyToOne(() => Customer)
    sourceUser!: Customer;
}