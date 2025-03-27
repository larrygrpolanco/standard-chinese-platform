<!-- src/lib/components/profile/SubscriptionTab.svelte -->
<script>
	import { onMount } from 'svelte';
	import {
		getUserSubscription,
		createCheckoutSession,
		createCustomerPortalSession
	} from '$lib/supabase/client';
	import { STRIPE_CONFIG } from '$lib/stripe/config';

	let subscription = { tier: 'loading' };
	let loading = false;
	let error = null;

	onMount(async () => {
		try {
			subscription = await getUserSubscription();
		} catch (err) {
			error = err.message;
			subscription = { tier: 'free' };
		}
	});

	async function handleUpgrade() {
		try {
			loading = true;
			error = null;
			const url = await createCheckoutSession();
			window.location.href = url;
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	async function handleManageSubscription() {
		try {
			loading = true;
			error = null;
			const url = await createCustomerPortalSession();
			window.location.href = url;
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function formatDate(isoString) {
		if (!isoString) return '';
		const date = new Date(isoString);
		return date.toLocaleDateString();
	}
</script>

<div class="account-tab">
	<section>
		<h2 class="section-title">Your Subscription</h2>

		{#if subscription.tier === 'loading'}
			<div class="loading-spinner">
				<div class="spinner"></div>
			</div>
		{:else}
			<div class="subscription-card">
				<div class="sub-status">
					<span class="sub-status-label">Current Plan:</span>
					<span class="sub-status-value {subscription.tier}">
						{subscription.tier === 'premium' ? 'Premium Membership' : 'Free Membership'}
					</span>
				</div>

				{#if subscription.tier === 'premium'}
					<div class="sub-details">
						<span class="sub-label">Active until:</span>
						<span class="sub-value">{formatDate(subscription.expiresAt)}</span>
					</div>

					<div class="sub-features">
						<h3 class="sub-features-title">Features:</h3>
						<ul class="features-list">
							<li class="feature">
								<svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								<span>{STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day} RWP exercises per day</span>
							</li>
							<li class="feature">
								<svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								<span>RWP Listening Exercise access</span>
							</li>
							<li class="feature">
								<svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								<span>Access to all FSI course materials</span>
							</li>
						</ul>
					</div>

					<div class="sub-actions">
						<button
							class="tape-button manage"
							on:click={handleManageSubscription}
							disabled={loading}
						>
							{loading ? 'Loading...' : 'Manage Subscription'}
						</button>
					</div>
				{:else}

					<div class="sub-features">
						<h3 class="sub-features-title">Features:</h3>
						<ul class="features-list">
							<li class="feature">
								<svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								<span>{STRIPE_CONFIG.FREE_TIER_LIMITS.rwp_per_week} RWP exercises per week</span>
							</li>
							<li class="feature">
								<svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M5 13l4 4L19 7"
									></path>
								</svg>
								<span>Access to all FSI course materials</span>
							</li>
							<li class="feature negative">
								<svg
									class="feature-icon negative"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
								<span>No Text-to-Speech access</span>
							</li>
						</ul>
					</div>

					<div class="upgrade-card">
						<h4 class="upgrade-title">Upgrade to Premium</h4>
						<p class="upgrade-desc">
							For just {STRIPE_CONFIG.PRODUCTS.MONTHLY_SUBSCRIPTION.price}, get:
						</p>
						<ul class="upgrade-features">
							<li>{STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day} RWP exercises daily</li>
							<li>RWP Listening Exercise access</li>
						</ul>
					</div>

					<div class="sub-actions">
						<button class="tape-button upgrade" on:click={handleUpgrade} disabled={loading}>
							{loading ? 'Loading...' : 'Upgrade Now'}
						</button>
					</div>
				{/if}
			</div>
		{/if}

		{#if error}
			<div class="error-message">
				{error}
			</div>
		{/if}
		<div class="subscription-message">
			Your subscription helps support the continued development of this site and keeps all the core
			material free for everyone.
		</div>
	</section>
</div>

<style>
	.account-tab {
		padding: 1.5rem;
		box-shadow:
			inset 0 1px 4px rgba(51, 49, 46, 0.15),
			4px 4px 0 var(--color-shadow);
		overflow: hidden;
		background-image:
			radial-gradient(circle at 15% 50%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 85% 30%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
	}

	.section-title {
		margin-bottom: 1.25rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
	}

	.subscription-card {
		padding: 1.25rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 8px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
		margin-bottom: 1rem;
	}

	.sub-status {
		display: flex;
		align-items: center;
		margin-bottom: 1rem;
	}

	.sub-status-label {
		margin-right: 0.5rem;
		font-weight: 500;
	}

	.sub-status-value {
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.sub-status-value.free {
		background-color: #a0998a;
		color: #f4f1de;
	}

	.sub-status-value.premium {
		background-color: #ddb967;
		color: #33312e;
	}

	.sub-details {
		margin-bottom: 1rem;
	}

	.sub-label {
		color: #70594a;
		margin-right: 0.5rem;
	}

	.sub-value {
		font-weight: 500;
		color: #33312e;
	}

	.sub-features {
		margin-bottom: 1.25rem;
	}

	.sub-features-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #33312e;
	}

	.features-list {
		list-style: none;
		padding: 0;
	}

	.feature {
		display: flex;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.feature-icon {
		width: 1.25rem;
		height: 1.25rem;
		margin-right: 0.5rem;
		color: #4caf50;
	}

	.feature-icon.negative {
		color: #f44336;
	}

	.upgrade-card {
		background-color: #f9f0e0;
		border: 1px solid #ddb967;
		border-radius: 8px;
		padding: 1rem;
		margin-bottom: 1.5rem;
	}

	.upgrade-title {
		font-weight: 600;
		font-size: 1.1rem;
		color: #826d5b;
		margin-bottom: 0.5rem;
	}

	.upgrade-desc {
		margin-bottom: 0.75rem;
	}

	.upgrade-features {
		list-style: disc;
		padding-left: 1.5rem;
		margin-bottom: 0.75rem;
	}

	.upgrade-features li {
		margin-bottom: 0.25rem;
	}

	.sub-actions {
		margin-bottom: 1rem;
	}

	.tape-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		color: #33312e;
		border: none;
		border-radius: 16px;
		transition: all 0.2s;
		cursor: pointer;
	}

	.tape-button.upgrade {
		background-color: #ddb967;
		color: #33312e;
		box-shadow: 0 2px 0 #826d5b;
	}

	.tape-button.manage {
		background-color: #a0998a;
		color: #f4f1de;
	}

	.tape-button:hover:not(:disabled) {
		filter: brightness(0.95);
	}

	.tape-button:active:not(:disabled) {
		transform: translateY(2px);
		box-shadow: 0 0 0 #826d5b;
	}

	.tape-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.subscription-message {
		font-size: 0.875rem;
		font-style: italic;
		color: #70594a;
		text-align: center;
		margin-top: 1rem;
	}

	.loading-spinner {
		display: flex;
		justify-content: center;
		padding: 2rem;
	}

	.spinner {
		height: 3rem;
		width: 3rem;
		border-radius: 50%;
		border: 3px solid #e8e5d7;
		border-top-color: #ddb967;
		animation: spin 1s linear infinite;
	}

	.error-message {
		padding: 1rem;
		background-color: #f8d7da;
		color: #721c24;
		border: 1px solid #f5c6cb;
		border-radius: 8px;
		margin-top: 1rem;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.account-tab {
			padding: 1rem;
		}
	}
</style>
