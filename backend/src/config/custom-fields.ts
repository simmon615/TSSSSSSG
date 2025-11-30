import { CustomFields, Customer, LanguageCode } from '@vendure/core';

export const customFields: CustomFields = {
    Customer: [
        {
            name: 'telegramId',
            type: 'string',
            unique: true,
            public: false,
            nullable: true,
            ui: { tab: 'Telegram' },
        },
        {
            name: 'referrer',
            type: 'relation',
            entity: Customer,
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
            label: [{ languageCode: LanguageCode.en, value: 'Point Balance' }],
        },
        {
            name: 'shoppingBalance',
            type: 'float',
            defaultValue: 0.00,
            public: true,
            ui: { tab: 'Assets', component: 'currency-form-input' },
            label: [{ languageCode: LanguageCode.en, value: 'Shopping Balance' }],
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
            label: [{ languageCode: LanguageCode.en, value: 'Reward Points' }],
        },
    ],
    // 修改处：将 OrderAddress 改为 Order，并重命名字段以防冲突
    Order: [
        {
            name: 'shippingLat',
            type: 'float',
            public: true,
            nullable: true,
            label: [{ languageCode: LanguageCode.en, value: 'Shipping Latitude' }],
        },
        {
            name: 'shippingLng',
            type: 'float',
            public: true,
            nullable: true,
            label: [{ languageCode: LanguageCode.en, value: 'Shipping Longitude' }],
        }
    ]
};