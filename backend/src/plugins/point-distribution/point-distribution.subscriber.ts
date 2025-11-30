import { EventBus, OrderStateTransitionEvent } from '@vendure/core';
import { Injectable } from '@nestjs/common'; // <--- 修正：从 @nestjs/common 导入
import { PointDistributionService } from '../../services/point-distribution.service';

@Injectable()
export class PointDistributionSubscriber {
    constructor(private pointDistributionService: PointDistributionService) {}

    subscribe(eventBus: EventBus) {
        eventBus.ofType(OrderStateTransitionEvent).subscribe(async (event: OrderStateTransitionEvent) => {
            // 当订单状态从 'ArrangingPayment' 变为 'PaymentSettled' 时触发
            if (event.fromState === 'ArrangingPayment' && event.toState === 'PaymentSettled') {
                await this.pointDistributionService.distributePointsForOrder(event.ctx, event.order);
            }
        });
    }
}