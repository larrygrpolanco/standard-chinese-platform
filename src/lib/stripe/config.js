// src/lib/stripe/config.js
export const STRIPE_CONFIG = {
	FREE_TIER_LIMITS: {
		rwp_per_week: 3,
		tts_access: false
	},

	PREMIUM_TIER_LIMITS: {
		rwp_per_day: 20,
		tts_per_day: 20, // Add this line
		tts_access: true
	},

	PRODUCTS: {
		MONTHLY_SUBSCRIPTION: {
			name: 'Monthly Premium',
			price: '$5/month',
			price_id: 'price_1R6WB8A4kfkUd2x1S7lXsvOH'
		}
	}
};
