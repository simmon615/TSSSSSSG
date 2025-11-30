import { CustomFields } from '@vendure/core';

export const customFields: CustomFields = {
    Customer: [
        {
            name: 'telegramId',
            type: 'string',
            public: false,
            nullable: true,
            ui: { tab: 'Telegram' },
        },
        {
            name: 'pointBalance',
            type: 'int',
            defaultValue: 0,
            public: true,
            ui: { tab: 'Assets', component: 'number-form-input' },
        },
        {
            name: 'shoppingBalance',
            type: 'float', // Note: Stored as float, handled as Decimal in logic
            defaultValue: 0.00,
            public: true,
            ui: { tab: 'Assets', component: 'currency-form-input' },
        },
        {
            name: 'mainBalance',
            type: 'float',
            defaultValue: 0.00,
            public: true,
            ui: { tab: 'Assets', component: 'currency-form-input' },
        },
        {
            name: 'referrer',
            type: 'relation',
            entity: 'Customer',
            public: false,
            nullable: true,
            ui: { tab: 'Telegram' },
        },
        {
            name: 'paymentInfo',
            type: 'text',
            public: false,
            nullable: true,
            ui: { tab: 'Assets' },
        },
    ],
    ProductVariant: [
        {
            name: 'rewardPoints',
            type: 'int',
            defaultValue: 0,
            public: true,
            label: [{ languageCode: 'en', value: 'Reward Points' }],
        },
    ],
    OrderAddress: [
        {
            name: 'lat',
            type: 'float',
            public: true,
            nullable: true,
        },
        {
            name: 'lng',
            type: 'float',
            public: true,
            nullable: true,
        }
    ]
};