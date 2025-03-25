// src/lib/stripe/config.js
export const STRIPE_CONFIG = {
	// Centralized place to adjust limits
	FREE_TIER_LIMITS: {
		rwp_per_week: 3,
		tts_access: false
	},

	PREMIUM_TIER_LIMITS: {
		rwp_per_day: 20,
		tts_access: true
	},

	PRODUCTS: {
		MONTHLY_SUBSCRIPTION: {
			name: 'Monthly Premium',
			price: '$5/month'
			// You'll add your Stripe price ID here once set up
			// price_id: 'price_YOUR_ID_HERE'
		}
	}
};
