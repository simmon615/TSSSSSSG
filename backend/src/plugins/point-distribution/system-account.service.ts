import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TransactionalConnection } from '@vendure/core';

@Injectable()
export class SystemAccountInitService implements OnApplicationBootstrap {
    constructor(private connection: TransactionalConnection) {}

    async onApplicationBootstrap() {
        const rawConn = this.connection.rawConnection;

        // 1. Check if ID 0 exists
        const result = await rawConn.query(`SELECT id FROM customer WHERE id = 0`);

        if (result.length === 0) {
            console.log('System Account (ID: 0) not found. Creating...');
            
            // 2. Insert into Customer Table (使用驼峰式列名)
            // 注意: Postgres 对大小写敏感，如果列名是驼峰，必须加双引号 "createdAt"
            // 或者 Vendure 默认配置通常会自动转义。为了稳妥，我们使用双引号包裹列名。
            await rawConn.query(`
                INSERT INTO "customer" (
                    "id", "createdAt", "updatedAt", 
                    "emailAddress", "firstName", "lastName", 
                    "phoneNumber", "deletedAt"
                ) VALUES (
                    0, NOW(), NOW(), 
                    'system-profit@internal.local', 'System', 'Profit', 
                    '00000000', NULL
                )
            `);

            console.log('System Account created successfully.');
        }
    }
}