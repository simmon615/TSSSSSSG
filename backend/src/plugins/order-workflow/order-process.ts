import { OrderProcess } from '@vendure/core';

export const customOrderProcess: OrderProcess<string> = {
    transitions: {
        Shipped: {
            to: ['Delivered', 'Cancelled'],
            mergeStrategy: 'merge',
        },
        Delivered: {
            to: ['Completed', 'Cancelled'], // Completed might be auto-set by Vendure or via T+15
        },
    },
};