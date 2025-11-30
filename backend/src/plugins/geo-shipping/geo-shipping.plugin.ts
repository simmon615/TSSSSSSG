import { PluginCommonModule, VendurePlugin } from '@vendure/core';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [],
    configuration: config => {
        return config;
    },
})
export class GeoShippingPlugin {}