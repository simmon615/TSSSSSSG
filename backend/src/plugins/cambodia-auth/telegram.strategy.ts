import { AuthenticationStrategy, User, ExternalAuthenticationService, Injector, RequestContext, Logger, Injectable } from '@vendure/core';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import * as crypto from 'crypto';

export type TelegramAuthData = {
    initData: string;
};

@Injectable()
export class TelegramAuthStrategy implements AuthenticationStrategy<TelegramAuthData> {
    readonly name = 'telegram';
    private externalAuthenticationService: ExternalAuthenticationService;

    init(injector: Injector) {
        this.externalAuthenticationService = injector.get(ExternalAuthenticationService);
    }

    defineInputType(): DocumentNode {
        return gql`
            input TelegramAuthInput {
                initData: String!
            }
        `;
    }

    async authenticate(ctx: RequestContext, data: TelegramAuthData): Promise<User | false> {
        const userData = this.validateAndParseInitData(data.initData);
        if (!userData) {
            return false;
        }

        const user = await this.externalAuthenticationService.findCustomerUser(ctx, this.name, userData.id.toString());

        if (user) {
            return user;
        }

        return false;
    }

    private validateAndParseInitData(initData: string): any | null {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        
        if (!hash) return null;

        urlParams.delete('hash');
        
        const dataCheckString = Array.from(urlParams.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        const secretKey = crypto.createHmac('sha256', 'WebAppData')
            .update(process.env.TELEGRAM_BOT_TOKEN || '') 
            .digest();

        const calculatedHash = crypto.createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        if (calculatedHash === hash) {
            const userJson = urlParams.get('user');
            if (userJson) {
                return JSON.parse(userJson);
            }
        }
        
        Logger.warn('Telegram signature validation failed', 'TelegramAuthStrategy');
        return null;
    }
}