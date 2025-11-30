import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { EmailPlugin, defaultEmailHandlers } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import 'dotenv/config';
import path from 'path';

// 导入自定义字段配置
import { customFields } from './config/custom-fields';

// 导入业务插件
import { CambodiaAuthPlugin } from './plugins/cambodia-auth/cambodia-auth.plugin';
import { AssetExchangePlugin } from './plugins/asset-exchange/asset-exchange.plugin';
import { PointDistributionPlugin } from './plugins/point-distribution/point-distribution.plugin';
import { OrderWorkflowPlugin } from './plugins/order-workflow/order-workflow.plugin';
import { GeoShippingPlugin } from './plugins/geo-shipping/geo-shipping.plugin';

// 导入自定义 Handler 和 Calculator
import { shoppingBalancePaymentHandler } from './plugins/asset-exchange/shopping-balance.handler';
import { geoShippingCalculator } from './plugins/geo-shipping/geo-shipping.calculator';

const IS_DEV = process.env.APP_ENV === 'dev';

// 修复 TypeScript 环境下可能找不到 __dirname 的问题
declare const __dirname: string;

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        ...(IS_DEV ? {
            middleware: [],
            apolloServerPlugins: [],
        } : {}),
    },
    authOptions: {
        tokenMethod: ['bearer', 'cookie'],
        superadminCredentials: {
            identifier: process.env.SUPERADMIN_USERNAME || 'superadmin',
            password: process.env.SUPERADMIN_PASSWORD || 'superadmin',
        },
        cookieOptions: {
            secret: process.env.COOKIE_SECRET || 'cookie-secret',
        },
        shopAuthenticationStrategy: [
             // 具体的策略由 CambodiaAuthPlugin 注入
        ]
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: true, 
        logging: false,
        database: process.env.DB_NAME || 'vendure',
        host: process.env.DB_HOST || 'localhost',
        port: +process.env.DB_PORT! || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        migrations: [path.join(__dirname, './migrations/*.ts')],
		
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler, shoppingBalancePaymentHandler],
    },
    shippingOptions: {
        shippingCalculators: [geoShippingCalculator],
    },
    customFields: customFields,
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
        }),

        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),

        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        
        /*EmailPlugin.init({
            devMode: true,
            outputPath: path.join(__dirname, '../static/email/test-emails'),
            route: 'mailbox',
            handlers: defaultEmailHandlers,
        }),
*/
        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
        }),
        
        // --- 注册自定义业务插件 ---
        CambodiaAuthPlugin,
        AssetExchangePlugin,
        PointDistributionPlugin,
        OrderWorkflowPlugin,
        GeoShippingPlugin
    ],
};