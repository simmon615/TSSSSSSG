import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { 
    RequestContext, 
    Ctx, 
    OrderService,
    Allow,
    Permission
} from '@vendure/core';

@Resolver()
export class OrderWorkflowResolver {
    constructor(private orderService: OrderService) {}

    @Mutation()
    @Allow(Permission.Owner)
    async confirmReceipt(@Ctx() ctx: RequestContext, @Args('orderId') orderId: string | number) {
        // Transition order to 'Delivered'
        return await this.orderService.transitionToState(ctx, orderId, 'Delivered');
    }
}