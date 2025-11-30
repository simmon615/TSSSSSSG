import { OrderProcess } from '@vendure/core';

export const customOrderProcess: OrderProcess<string> = {
    transitions: {
        // 允许从 Shipped -> Delivered
        Shipped: {
            to: ['Delivered', 'Cancelled'],
            mergeStrategy: 'merge',
        },
        // 定义 Delivered 状态的后续流转
        Delivered: {
            to: ['Cancelled'], 
            mergeStrategy: 'merge',
        },
        // 必须处理 Cancelled 状态，否则校验会失败
        Cancelled: {
            to: [],
            mergeStrategy: 'merge',
        }
    },
};