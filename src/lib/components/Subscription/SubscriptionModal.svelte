<!-- src/lib/components/Subscription/SubscriptionModal.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { STRIPE_CONFIG } from '$lib/stripe/config';

	export let showModal = false;
	export let usageStats = null;
	export let trigger = 'general'; // 'general', 'rwp', 'tts'

	const dispatch = createEventDispatcher();

	let isLoading = false;
	let error = null;

	function closeModal() {
		dispatch('close');
	}

	// Component method updates (SubscriptionModal.svelte)
	async function handleSubscribe() {
		isLoading = true;
		error = null;

		try {
			// No need to pass tokens - server uses session cookie
			const response = await fetch('/api/stripe/create-checkout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to create checkout session');
			}

			const { url } = await response.json();
			window.location.href = url;
		} catch (err) {
			console.error('Subscription error:', err);
			error = err.message;
			showToast(error, 'error');
		} finally {
			isLoading = false;
		}
	}

	async function handleManageSubscription() {
		isLoading = true;
		error = null;

		try {
			// No need to pass user data - server uses session
			const response = await fetch('/api/stripe/create-portal', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || 'Failed to create customer portal session');
			}

			const { url } = await response.json();
			window.location.href = url;
		} finally {
			isLoading = false;
		}
	}
</script>

{#if showModal}
	<div class="modal-backdrop" on:click|self={closeModal}>
		<div class="modal-container">
			<div class="modal-header">
				<h2 class="modal-title">
					{#if trigger === 'rwp'}
						Unlock More RWP Practice
					{:else if trigger === 'tts'}
						Unlock TTS Audio
					{:else}
						RWP Premium Access
					{/if}
				</h2>
				<button class="modal-close-btn" on:click={closeModal}>×</button>
			</div>

			<div class="modal-content">
				{#if usageStats}
					{#if usageStats.subscription.status === 'active'}
						<!-- Premium user content -->
						<div class="subscription-info premium">
							<div class="subscription-status">
								<span class="status-icon">✓</span>
								<span class="status-text">Premium Subscription Active</span>
							</div>

							<p class="subscription-details">
								Your subscription renews on {new Date(
									usageStats.subscription.renewalDate
								).toLocaleDateString()}.
							</p>

							<div class="usage-stats">
								<h3>Your Usage</h3>
								<div class="usage-item">
									<span class="usage-label">RWP Exercises:</span>
									<span class="usage-value"
										>{usageStats.rwp.count} used today / {usageStats.rwp.limit} daily limit</span
									>
								</div>
							</div>

							<div class="premium-features">
								<h3>Your Premium Features</h3>
								<ul>
									<li>
										Generate up to {STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day} RWP exercises per
										day
									</li>
									<li>TTS Audio for listening comprehension</li>
									<li>Support the development of Taped Chinese</li>
								</ul>
							</div>

							<button
								class="tape-button manage-button"
								on:click={handleManageSubscription}
								disabled={isLoading}
							>
								{isLoading ? 'Loading...' : 'Manage Subscription'}
							</button>
						</div>
					{:else}
						<!-- Free user content -->
						<div class="subscription-info free">
							<div class="usage-stats">
								<h3>Your Current Usage</h3>
								<div class="usage-item">
									<span class="usage-label">RWP Exercises:</span>
									<span class="usage-value"
										>{usageStats.rwp.count} used / {usageStats.rwp.limit} weekly limit</span
									>
									{#if usageStats.rwp.resetAt}
										<span class="reset-info"
											>Resets on {new Date(usageStats.rwp.resetAt).toLocaleDateString()}</span
										>
									{/if}
								</div>
							</div>

							<div class="pricing-box">
								<div class="price-header">
									<h3>Premium Subscription</h3>
									<div class="price-amount">$5<span class="price-period">/month</span></div>
								</div>

								<div class="price-features">
									<h4>What You Get:</h4>
									<ul>
										<li>
											<span class="feature-icon">⚡</span>
											<span class="feature-text">
												<strong
													>{STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day} daily RWP exercises</strong
												>
												(instead of {STRIPE_CONFIG.FREE_TIER_LIMITS.rwp_per_week} weekly)
											</span>
										</li>
										<li>
											<span class="feature-icon">🔊</span>
											<span class="feature-text">
												<strong>TTS Audio</strong> for listening comprehension
											</span>
										</li>
										<li>
											<span class="feature-icon">❤️</span>
											<span class="feature-text">Support Taped Chinese development</span>
										</li>
									</ul>
								</div>

								<div class="cost-note">
									<p>
										Your subscription helps cover the AI costs for RWP generation and keeps the core
										course materials free for everyone.
									</p>
								</div>

								<button
									class="tape-button subscribe-button"
									on:click={handleSubscribe}
									disabled={isLoading}
								>
									{isLoading ? 'Loading...' : 'Subscribe Now'}
								</button>
							</div>
						</div>
					{/if}
				{:else}
					<div class="loading">Loading subscription information...</div>
				{/if}

				{#if error}
					<div class="error-message">{error}</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Modal styles go here - should match your existing styling */
	/* ... */
</style>
