import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { 
    RequestContext, 
    Ctx, 
    Transaction, 
    AuthService, 
    CustomerService, 
    UserInputError,
    TransactionalConnection,
    Customer,
    User
} from '@vendure/core';
import { TelegramAuthStrategy } from './telegram.strategy';

@Resolver()
export class AuthResolver {
    constructor(
        private authService: AuthService,
        private customerService: CustomerService,
        private connection: TransactionalConnection,
        private telegramStrategy: TelegramAuthStrategy
    ) {}

    @Mutation()
    @Transaction()
    async registerWithTelegram(
        @Ctx() ctx: RequestContext,
        @Args('initData') initData: string,
        @Args('referrerCode') referrerCode: string,
        @Args('phoneNumber') phoneNumber: string
    ) {
        // 1. Validate Referrer (Strict Check)
        const referrer = await this.validateReferrer(ctx, referrerCode);

        // 2. Check duplicate phone
        const existingUser = await this.connection.getRepository(ctx, User).findOne({
            where: { identifier: phoneNumber }
        });
        if (existingUser) {
            throw new UserInputError('Phone number already registered. Please login.');
        }

        // 3. Create Customer
        // Pass password as second argument
        const customerResult = await this.customerService.create(ctx, {
            emailAddress: `${phoneNumber}@placeholder.com`,
            phoneNumber: phoneNumber,
            firstName: 'TG User', 
            lastName: '',
        }, Math.random().toString(36));

        if (!(customerResult instanceof Customer)) {
            const errorMessage = (customerResult as any).message || 'Could not create customer';
            throw new UserInputError(errorMessage);
        }

        const customer = customerResult;

        // 4. Bind Referrer
        (customer.customFields as any).referrer = referrer;
        
        await this.connection.getRepository(ctx, Customer).save(customer);

        // 5. History Log (Removed to avoid type issues with internal services)
        
        return { success: true, customer };
    }

    private async validateReferrer(ctx: RequestContext, code: string): Promise<Customer> {
        // Seed User Backdoor
        if (code === 'ADMIN_SEED_888') {
            const systemRoot = await this.connection.getEntityOrThrow(ctx, Customer, 1) as Customer;
            return systemRoot;
        }

        const customerRepo = this.connection.getRepository(ctx, Customer);
        
        let referrer: Customer | null = null;
        
        // Try ID
        if (!isNaN(Number(code))) {
             referrer = await customerRepo.findOne({ where: { id: code } });
        }

        // Try Phone
        if (!referrer) {
            referrer = await customerRepo.findOne({ where: { phoneNumber: code } });
        }

        if (!referrer) {
            throw new UserInputError(`Invalid Referral Code: ${code}. Registration requires a valid inviter.`);
        }

        return referrer;
    }
}