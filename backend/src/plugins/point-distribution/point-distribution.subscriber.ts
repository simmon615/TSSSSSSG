import { EventBus, OrderStateTransitionEvent, Injectable } from '@vendure/core';
import { PointDistributionService } from '../../services/point-distribution.service';

@Injectable()
export class PointDistributionSubscriber {
    constructor(private pointDistributionService: PointDistributionService) {}

    subscribe(eventBus: EventBus) {
        eventBus.ofType(OrderStateTransitionEvent).subscribe(async (event: OrderStateTransitionEvent) => {
            // Trigger when order is paid (ArrangingPayment -> PaymentSettled)
            if (event.fromState === 'ArrangingPayment' && event.toState === 'PaymentSettled') {
                await this.pointDistributionService.distributePointsForOrder(event.ctx, event.order);
            }
        });
    }
}