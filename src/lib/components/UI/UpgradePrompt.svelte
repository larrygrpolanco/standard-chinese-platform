<!-- src/lib/components/UI/UpgradePrompt.svelte -->
<script>
	import { createCheckoutSession, createCustomerPortalSession } from '$lib/supabase/client';
	import { STRIPE_CONFIG } from '$lib/stripe/config';

	export let status = {
		allowed: false,
		reason: '',
		tier: 'free',
		resetTime: null,
		remaining: 0
	};

	let loading = false;
	let error = null;

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

	function formatResetTime(resetTime) {
		if (!resetTime) return '';

		const now = new Date();
		const reset = new Date(resetTime);

		// If today
		if (now.toDateString() === reset.toDateString()) {
			return `today at ${reset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
		}

		// If tomorrow
		const tomorrow = new Date(now);
		tomorrow.setDate(tomorrow.getDate() + 1);
		if (tomorrow.toDateString() === reset.toDateString()) {
			return `tomorrow at ${reset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
		}

		// Otherwise show date and time
		return reset.toLocaleString([], {
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="mb-6 rounded-md border border-amber-200 bg-amber-50 p-6 text-amber-800">
	<h3 class="mb-2 text-lg font-semibold">
		{#if status.reason === 'Weekly limit reached'}
			Weekly RWP Limit Reached
		{:else if status.reason === 'Daily limit reached'}
			Daily RWP Limit Reached
		{:else if status.reason === 'Daily TTS limit reached'}
			Daily TTS Limit Reached
		{:else if status.reason === 'TTS requires premium subscription'}
			Text-to-Speech Requires Premium
		{:else}
			Feature Limit Reached
		{/if}
	</h3>

	<p class="mb-4">
		{#if status.reason === 'Weekly limit reached'}
			You've used all your {STRIPE_CONFIG.FREE_TIER_LIMITS.rwp_per_week} weekly RWP exercises.
			{#if status.resetTime}
				<span class="mt-1 block">Your limit will reset {formatResetTime(status.resetTime)}.</span>
			{/if}
		{:else if status.reason === 'Daily limit reached'}
			You've used all your {STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day} daily RWP exercises.
			{#if status.resetTime}
				<span class="mt-1 block">Your limit will reset {formatResetTime(status.resetTime)}.</span>
			{/if}
		{:else if status.reason === 'Daily TTS limit reached'}
			You've used all your {STRIPE_CONFIG.PREMIUM_TIER_LIMITS.tts_per_day} daily Text-to-Speech conversions.
			{#if status.resetTime}
				<span class="mt-1 block">Your limit will reset {formatResetTime(status.resetTime)}.</span>
			{/if}
		{:else if status.reason === 'TTS requires premium subscription'}
			Text-to-Speech is a premium feature that helps you practice pronunciation.
		{:else}
			{status.reason}
		{/if}
	</p>

	{#if status.tier === 'free'}
		<div class="mb-4 rounded-md border border-amber-200 bg-white p-4">
			<h4 class="mb-2 font-semibold">Upgrade to Premium</h4>
			<p class="mb-2">For just {STRIPE_CONFIG.PRODUCTS.MONTHLY_SUBSCRIPTION.price}, get:</p>
			<ul class="mb-2 list-inside list-disc">
				<li>{STRIPE_CONFIG.PREMIUM_TIER_LIMITS.rwp_per_day} RWP exercises daily</li>
				<li>{STRIPE_CONFIG.PREMIUM_TIER_LIMITS.tts_per_day} Text-to-Speech conversions daily</li>
			</ul>
		</div>

		<button
			class="rounded-md bg-amber-500 px-4 py-2 text-white transition hover:bg-amber-600"
			on:click={handleUpgrade}
			disabled={loading}
		>
			{loading ? 'Loading...' : 'Upgrade Now'}
		</button>
	{:else}
		<p class="text-sm italic">You'll be able to use more {status.reason.includes('TTS') ? 'TTS conversions' : 'RWP exercises'} when your limit resets.</p>
		
		<button
			class="mt-3 text-sm text-amber-600 underline hover:text-amber-800"
			on:click={handleManageSubscription}
			disabled={loading}
		>
			{loading ? 'Loading...' : 'Manage your subscription'}
		</button>
	{/if}

	{#if error}
		<div class="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
			{error}
		</div>
	{/if}
</div>