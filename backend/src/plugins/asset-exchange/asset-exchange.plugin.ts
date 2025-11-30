import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Module } from '@nestjs/common';
import gql from 'graphql-tag';
import { AssetExchangeService } from '../../services/asset-exchange.service';
import { AssetExchangeResolver } from './api/asset-exchange.resolver';
import { TopUpRequest } from './entities/top-up-request.entity';
import { WithdrawalRequest } from './entities/withdrawal-request.entity';

@Module({
    imports: [PluginCommonModule],
    providers: [AssetExchangeService],
    exports: [AssetExchangeService],
})
export class AssetExchangeModule {}

@VendurePlugin({
    imports: [PluginCommonModule, AssetExchangeModule],
    entities: [TopUpRequest, WithdrawalRequest],
    shopApiExtensions: {
        schema: gql`
            type TopUpRequest implements Node {
                id: ID!
                createdAt: DateTime!
                updatedAt: DateTime!
                amount: Float!
                status: String!
                proofImage: String!
            }

            type WithdrawalRequest implements Node {
                id: ID!
                createdAt: DateTime!
                updatedAt: DateTime!
                pointsDeducted: Int!
                cashAmount: Float!
                status: String!
            }

            extend type Mutation {
                requestTopUp(amount: Float!, proofImage: String!): TopUpRequest!
                requestWithdrawal(pointsToWithdraw: Int!, paymentDetails: JSON!): WithdrawalRequest!
            }
        `,
        resolvers: [AssetExchangeResolver],
    },
})
export class AssetExchangePlugin {}