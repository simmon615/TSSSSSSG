import {
    dummyPaymentHandler,
    DefaultJobQueuePlugin,
    DefaultSearchPlugin,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import 'dotenv/config';
import path from 'path';

import { customFields } from './config/custom-fields';
import { CambodiaAuthPlugin } from './plugins/cambodia-auth/cambodia-auth.plugin';
import { AssetExchangePlugin } from './plugins/asset-exchange/asset-exchange.plugin';
import { PointDistributionPlugin } from './plugins/point-distribution/point-distribution.plugin';
import { OrderWorkflowPlugin } from './plugins/order-workflow/order-workflow.plugin';
import { GeoShippingPlugin } from './plugins/geo-shipping/geo-shipping.plugin';
import { TelegramAuthStrategy } from './plugins/cambodia-auth/telegram.strategy';
import { shoppingBalancePaymentHandler } from './plugins/asset-exchange/shopping-balance.handler';
import { geoShippingCalculator } from './plugins/geo-shipping/geo-shipping.calculator';

const IS_DEV = process.env.APP_ENV === 'dev';

// Fix for __dirname missing in some TS configs
declare const __dirname: string;

export const config: VendureConfig = {
    apiOptions: {
        port: 3000,
        adminApiPath: 'admin-api',
        shopApiPath: 'shop-api',
        // The following options are useful in development mode,
        // but are best turned off for production for security
        // reasons.
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
             // Strategies are also registered in plugins
        ]
    },
    dbConnectionOptions: {
        type: 'postgres',
        synchronize: true, // Turn off in production
        logging: false,
        database: process.env.DB_NAME || 'vendure-cambodia',
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
    // Custom Fields Definition
    customFields: customFields,
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
        }),
        DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
        defaultEmailPlugin,
        AdminUiPlugin.init({
            route: 'admin',
            port: 3002,
        }),
        // Custom Business Plugins
        CambodiaAuthPlugin,
        AssetExchangePlugin,
        PointDistributionPlugin,
        OrderWorkflowPlugin,
        GeoShippingPlugin
    ],
};