import { PluginCommonModule, VendurePlugin, EventBus } from '@vendure/core';
import { Module } from '@nestjs/common';
import { PointDistributionService } from '../../services/point-distribution.service';
import { PointDistributionSubscriber } from './point-distribution.subscriber';
import { CommissionLog } from './entities/commission-log.entity';
import { SystemAccountInitService } from './system-account.service';

@Module({
    imports: [PluginCommonModule],
    providers: [PointDistributionService, PointDistributionSubscriber, SystemAccountInitService],
    exports: [PointDistributionService, PointDistributionSubscriber],
})
export class PointDistributionModule {}

@VendurePlugin({
    imports: [PluginCommonModule, PointDistributionModule],
    entities: [CommissionLog],
    configuration: config => {
        return config;
    },
})
export class PointDistributionPlugin {
    constructor(private eventBus: EventBus, private subscriber: PointDistributionSubscriber) {
        // Register the subscriber
        this.subscriber.subscribe(this.eventBus);
    }
}