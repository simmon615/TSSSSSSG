import { LanguageCode, ShippingCalculator } from '@vendure/core';

// Warehouse Coordinates (Phnom Penh Center)
const WAREHOUSE_LAT = 11.5564; 
const WAREHOUSE_LNG = 104.9282;

export const geoShippingCalculator = new ShippingCalculator({
    code: 'geo-shipping-calculator',
    description: [{ languageCode: LanguageCode.en, value: 'Distance Based Shipping (Cambodia)' }],
    args: {},
    calculate: async (ctx, order, args) => {
        const shippingAddress = order.shippingAddress;
        
        // Check if lat/lng exists in customFields
        if (!(shippingAddress as any)?.customFields?.lat || !(shippingAddress as any)?.customFields?.lng) {
            return {
                price: 200, // Default $2.00 if no GPS
                priceIncludesTax: true,
                taxRate: 0,
            };
        }

        const lat = (shippingAddress as any).customFields.lat;
        const lng = (shippingAddress as any).customFields.lng;

        // Haversine Formula
        const R = 6371; // Earth radius in km
        const dLat = (lat - WAREHOUSE_LAT) * (Math.PI / 180);
        const dLon = (lng - WAREHOUSE_LNG) * (Math.PI / 180);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(WAREHOUSE_LAT * (Math.PI / 180)) * Math.cos(lat * (Math.PI / 180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distanceKm = R * c;

        let priceUsd = 2.0;
        if (distanceKm > 15) {
            const extraKm = Math.ceil(distanceKm - 15);
            priceUsd += (extraKm * 0.5);
        }

        return {
            price: priceUsd * 100, // Convert to cents
            priceIncludesTax: true,
            taxRate: 0,
        };
    },
});