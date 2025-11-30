import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TransactionalConnection } from '@vendure/core';

@Injectable()
export class SystemAccountInitService implements OnApplicationBootstrap {
    constructor(private connection: TransactionalConnection) {}

    async onApplicationBootstrap() {
        const rawConn = this.connection.rawConnection;

        // 1. Check if ID 0 exists in main table
        const result = await rawConn.query(`SELECT id FROM customer WHERE id = 0`);

        if (result.length === 0) {
            console.log('System Account (ID: 0) not found. Creating...');
            
            // 2. Insert into Customer Table
            // Using a hardcoded ID=0 requires explicitly handling the sequence or forced insert
            await rawConn.query(`
                INSERT INTO customer (
                    id, created_at, updated_at, 
                    email_address, first_name, last_name, 
                    phone_number, deleted_at
                ) VALUES (
                    0, NOW(), NOW(), 
                    'system-profit@internal.local', 'System', 'Profit', 
                    '00000000', NULL
                )
            `);

            // 3. Handle Custom Fields Table (Standard in Vendure)
            // Vendure usually names it 'customer_custom_fields' linked by 'id'
            const hasCustomFieldsTable = await rawConn.query(`
                SELECT to_regclass('customer_custom_fields') as exists
            `);

            if (hasCustomFieldsTable[0].exists) {
                console.log('Initializing System Account Custom Fields...');
                // Insert default values for the custom fields
                await rawConn.query(`
                    INSERT INTO customer_custom_fields (id, pointbalance, shoppingbalance, mainbalance)
                    VALUES (0, 0, 0, 0)
                    ON CONFLICT (id) DO NOTHING
                `);
            }
            
            console.log('System Account created successfully.');
        }
    }
}