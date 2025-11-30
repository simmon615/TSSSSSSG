import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Module } from '@nestjs/common';
import { TelegramAuthStrategy } from './telegram.strategy';
import { AuthResolver } from './auth.resolver';
import gql from 'graphql-tag';

@Module({
    imports: [PluginCommonModule],
    providers: [TelegramAuthStrategy],
    exports: [TelegramAuthStrategy],
})
export class CambodiaAuthModule {}

@VendurePlugin({
    imports: [PluginCommonModule, CambodiaAuthModule],
    shopApiExtensions: {
        schema: gql`
            extend type Mutation {
                registerWithTelegram(initData: String!, referrerCode: String!, phoneNumber: String!): RegisterResponse!
            }
            type RegisterResponse {
                success: Boolean!
                customer: Customer
            }
        `,
        resolvers: [AuthResolver],
    },
    configuration: config => {
        config.authOptions.shopAuthenticationStrategy.push(new TelegramAuthStrategy());
        return config;
    }
})
export class CambodiaAuthPlugin {}