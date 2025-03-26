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

<div class="space-y-6">
	<h2 class="text-2xl font-bold">Your Subscription</h2>

	{#if subscription.tier === 'loading'}
		<div class="flex justify-center">
			<div class="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-amber-500"></div>
		</div>
	{:else}
		<div class="rounded-lg border border-amber-200 bg-amber-50 p-6">
			<h3 class="mb-2 text-xl font-semibold">
				{subscription.tier === 'premium' ? 'Premium Membership' : 'Free Membership'}
			</h3>

			{#if subscription.tier === 'premium'}
				<p class="mb-4">Your subscription is active until {formatDate(subscription.expiresAt)}.</p>
				<div class="mb-4 space-y-2">
					<div class="flex items-center">
						<svg
							class="mr-2 h-5 w-5 text-green-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path></svg
						>
						<span>{STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day} RWP exercises per day</span>
					</div>
					<div class="flex items-center">
						<svg
							class="mr-2 h-5 w-5 text-green-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path></svg
						>
						<span>Full Text-to-Speech access</span>
					</div>
				</div>

				<button
					class="rounded-md bg-amber-100 px-4 py-2 text-amber-800 transition hover:bg-amber-200"
					on:click={handleManageSubscription}
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Manage Subscription'}
				</button>
			{:else}
				<p class="mb-4">You're currently on the free plan.</p>
				<div class="mb-4 space-y-2">
					<div class="flex items-center">
						<svg
							class="mr-2 h-5 w-5 text-green-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							></path></svg
						>
						<span>{STRIPE_CONFIG.FREE_TIER_LIMITS.rwp_per_week} RWP exercises per week</span>
					</div>
					<div class="flex items-center">
						<svg
							class="mr-2 h-5 w-5 text-red-500"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							><path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path></svg
						>
						<span>No Text-to-Speech access</span>
					</div>
				</div>

				<div class="mb-4 rounded-md border border-amber-300 bg-amber-100 p-4">
					<h4 class="mb-2 font-semibold text-amber-800">Upgrade to Premium</h4>
					<p class="mb-2">For just {STRIPE_CONFIG.PRODUCTS.MONTHLY_SUBSCRIPTION.price}, get:</p>
					<ul class="mb-2 list-inside list-disc">
						<li>{STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day} RWP exercises daily</li>
						<li>Full Text-to-Speech access</li>
					</ul>
				</div>

				<button
					class="rounded-md bg-amber-500 px-4 py-2 text-white transition hover:bg-amber-600"
					on:click={handleUpgrade}
					disabled={loading}
				>
					{loading ? 'Loading...' : 'Upgrade Now'}
				</button>
			{/if}
		</div>
	{/if}

	{#if error}
		<div class="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
			{error}
		</div>
	{/if}
</div>
