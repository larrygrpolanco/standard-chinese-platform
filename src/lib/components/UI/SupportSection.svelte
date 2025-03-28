<!-- src/lib/components/UI/SupportSection.svelte -->
<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import {
		getUserSubscription,
		createCheckoutSession,
		createCustomerPortalSession
	} from '$lib/supabase/client';

	// No user prop needed - we'll use the authStore directly
	let isInitialized = false;
	let upgradeLoading = false;
	let upgradeError = null;
	let subscriptionStatus = 'loading';

	const dispatch = createEventDispatcher();

	// This function handles the subscription check once we know auth state
	async function checkSubscription() {
		if ($authStore) {
			try {
				const subscription = await getUserSubscription();
				subscriptionStatus = subscription.tier;
			} catch (err) {
				console.error('Error checking subscription:', err);
				subscriptionStatus = 'error';
			}
		} else {
			subscriptionStatus = 'none';
		}
		isInitialized = true;
	}

	onMount(async () => {
		// Wait for auth store to initialize first
		await authStore.initialize();
		checkSubscription();

		// Re-check subscription if auth state changes
		return authStore.subscribe(() => {
			if (isInitialized) {
				checkSubscription();
			}
		});
	});

	async function handleUpgrade() {
		try {
			upgradeLoading = true;
			upgradeError = null;
			const url = await createCheckoutSession();
			window.location.href = url;
		} catch (err) {
			upgradeError = err.message;
			dispatch('toast', {
				message: 'Failed to start checkout: ' + err.message,
				type: 'error'
			});
		} finally {
			upgradeLoading = false;
		}
	}
</script>

<section class="support-section">
	{#if !isInitialized}
		<!-- Show nothing until we're fully initialized -->
	{:else}
		<div class="support-card">
			<div class="card-header">
				<div class="tape-icon">
					<!-- Cassette tape icon -->
					<svg
						class="cassette-icon"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="3"
							y="6"
							width="18"
							height="12"
							rx="1"
							stroke="currentColor"
							stroke-width="2"
						/>
						<circle cx="8" cy="12" r="2" stroke="currentColor" stroke-width="2" />
						<circle cx="16" cy="12" r="2" stroke="currentColor" stroke-width="2" />
						<line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="2" />
					</svg>
				</div>
				<h3 class="support-heading">
					{#if subscriptionStatus === 'premium'}
						Thank you for your support!
					{:else if !$authStore}
						Join Taped Chinese
					{:else}
						Why Subscribe?
					{/if}
				</h3>
			</div>

			{#if subscriptionStatus === 'loading'}
				<p class="support-text">Loading subscription information...</p>
			{:else if !$authStore}
				<p class="support-text">
					Sign up to track your progress, create your own practice exercises, and access premium
					features. The core course materials are free, but a premium subscription helps support the
					platform.
				</p>
			{:else if subscriptionStatus === 'premium'}
				<div class="thank-you-message">
					<p class="support-text">
						Taped Chinese was created to make the FSI learning materials easily accessible to
						everyone. Your support helps make this possible.
					</p>
				</div>
			{:else}
				<p class="support-text">
					Taped Chinese was created to make the FSI learning materials easily accessible to
					everyone. The core course materials will always remain free, but your subscription helps
					cover server costs, development, and features like the RWP exercises.
				</p>

				<div class="benefits">
					<p>Subscribers get <strong>unlimited RWP exercises </strong> instead of 3 weekly.</p>
				</div>
			{/if}

			<div class="support-action">
				{#if !$authStore}
					<a href="/login" class="tape-button login">Sign up or Log in</a>
				{:else if subscriptionStatus === 'free'}
					<button class="tape-button subscribe" on:click={handleUpgrade} disabled={upgradeLoading}>
						{upgradeLoading ? 'Processing...' : 'Subscribe for $5/month'}
					</button>
				{/if}
			</div>

			{#if upgradeError}
				<p class="error-message">{upgradeError}</p>
			{/if}
		</div>
	{/if}
</section>

<style>
	.support-section {
		margin-bottom: 1.5rem;
	}

	.support-card {
		padding: 1.25rem;
		background-color: rgba(221, 185, 103, 0.1);
		border: 1px solid #ddb967;
		border-radius: 8px;
		text-align: center;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.card-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 0.75rem;
	}

	.tape-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5rem;
		height: 2.5rem;
		margin-bottom: 0.5rem;
		background-color: #ddb967;
		color: #33312e;
		border-radius: 8px;
		padding: 0.5rem;
	}

	.support-heading {
		font-family: 'Arvo', serif;
		font-size: 1.1rem;
		color: #33312e;
		margin: 0;
	}

	.support-text {
		margin-bottom: 0.75rem;
		color: #70594a;
		font-size: 0.95rem;
		max-width: 580px;
		margin-left: auto;
		margin-right: auto;
	}

	.thank-you-message {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.premium-badge {
		display: inline-block;
		background: linear-gradient(135deg, #ddb967 0%, #c9a043 100%);
		color: #33312e;
		font-size: 0.85rem;
		font-weight: 600;
		padding: 0.3rem 0.8rem;
		border-radius: 20px;
		margin-top: 0.25rem;
		margin-bottom: 0.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.benefits {
		padding: 0.5rem;
		background-color: #f4f1de;
		border-radius: 6px;
		margin-bottom: 1rem;
		font-size: 0.95rem;
	}

	.benefits p {
		margin: 0;
	}

	.support-action {
		margin-top: 0.75rem;
	}

	.tape-button {
		padding: 0.5rem 1.25rem;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		color: #f4f1de;
		border: none;
		border-radius: 9999px;
		box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
		cursor: pointer;
		display: inline-block;
		text-decoration: none;
	}

	.tape-button.subscribe {
		background-color: #826d5b;
	}

	.tape-button.login {
		background-color: #826d5b;
	}

	.tape-button:hover:not(:disabled) {
		filter: brightness(0.95);
	}

	.tape-button:active:not(:disabled) {
		transform: translateY(2px);
		box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
	}

	.error-message {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		color: #e74c3c;
	}

	.cassette-icon {
		color: var(--color-warm-gray, #a0998a);
		width: 61.8%; /* Golden ratio: 1/φ ≈ 61.8% */
		height: 61.8%;
	}

	@media (max-width: 640px) {
		.support-card {
			padding: 1rem;
		}
	}
</style>
