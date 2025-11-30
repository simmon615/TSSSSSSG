import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import gql from 'graphql-tag';
import { customOrderProcess } from './order-process';
import { OrderWorkflowResolver } from './api/order-workflow.resolver';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [],
    shopApiExtensions: {
        schema: gql`
            extend type Mutation {
                confirmReceipt(orderId: ID!): Order
            }
        `,
        resolvers: [OrderWorkflowResolver],
    },
    configuration: config => {
        // Register the custom state machine
        config.orderOptions.process.push(customOrderProcess);
        return config;
    }
})
export class OrderWorkflowPlugin {}