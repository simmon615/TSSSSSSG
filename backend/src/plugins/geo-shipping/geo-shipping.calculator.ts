import { LanguageCode, ShippingCalculator } from '@vendure/core';

// 仓库坐标 (金边某中心点)
const WAREHOUSE_LAT = 11.5564; 
const WAREHOUSE_LNG = 104.9282;

export const geoShippingCalculator = new ShippingCalculator({
    code: 'geo-shipping-calculator',
    description: [{ languageCode: LanguageCode.en, value: 'Distance Based Shipping (Cambodia)' }],
    args: {},
    calculate: async (ctx, order, args) => {
        // 修改处：从 order.customFields 读取 shippingLat/Lng
        // 注意：customFields 可能未定义，需要做空值检查
        const lat = (order.customFields as any)?.shippingLat;
        const lng = (order.customFields as any)?.shippingLng;
        
        // 如果没有坐标，返回默认 $2.00
        if (!lat || !lng) {
            return {
                price: 200, // $2.00
                priceIncludesTax: true,
                taxRate: 0,
            };
        }

        // Haversine 公式计算距离 (KM)
        const R = 6371; 
        const dLat = (lat - WAREHOUSE_LAT) * (Math.PI / 180);
        const dLon = (lng - WAREHOUSE_LNG) * (Math.PI / 180);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(WAREHOUSE_LAT * (Math.PI / 180)) * Math.cos(lat * (Math.PI / 180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distanceKm = R * c;

        // 计费规则
        let priceUsd = 2.0;
        if (distanceKm > 15) {
            const extraKm = Math.ceil(distanceKm - 15);
            priceUsd += (extraKm * 0.5);
        }

        return {
            price: priceUsd * 100, // 转换为分
            priceIncludesTax: true,
            taxRate: 0,
        };
    },
});