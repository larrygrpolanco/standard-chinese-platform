<!-- auth/callback/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/supabase/client';

	let error = null;

	onMount(async () => {
		// Handle the OAuth callback
		const { error: authError } = await supabase.auth.getSession();
		if (authError) {
			error = authError.message;
			return;
		}

		// Redirect to profile
		goto('/profile');
	});
</script>

{#if error}
	<div class="error-container">
		<h2>Authentication Error</h2>
		<p>{error}</p>
		<a href="/login">Return to login</a>
	</div>
{:else}
	<div class="loading-container">
		<p>Completing sign in...</p>
		<!-- You could add a loading spinner here -->
	</div>
{/if}

<style>
	.loading-container,
	.error-container {
		padding: 2rem;
		text-align: center;
	}
</style>
