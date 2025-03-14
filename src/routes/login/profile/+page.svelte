<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';

	let user = null;

	onMount(() => {
		// Redirect if not logged in
		if (!$authStore) {
			goto('/login');
			return;
		}
		user = $authStore;
	});

    // Later in your code:
async function handleSignOut() {
    try {
        await authStore.signOut();
        goto('/');
    } catch (error) {
        console.error('Error signing out:', error);
    }
}

</script>

<div class="profile-container mx-auto max-w-4xl p-6">
	<h1 class="mb-6 text-3xl font-bold">Your Profile</h1>

	{#if user}
		<div class="mb-6 rounded-lg bg-white p-6 shadow-md">
			<h2 class="mb-4 text-xl font-semibold">Account Information</h2>
			<p class="mb-2"><strong>Email:</strong> {user.email}</p>

			<!-- Optional properties that might not exist, add conditionals -->
			{#if user.last_sign_in_at}
				<p class="mb-2">
					<strong>Last Sign In:</strong>
					{new Date(user.last_sign_in_at).toLocaleString()}
				</p>
			{/if}
		</div>

		<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">Character Preferences</h2>
				<div class="space-y-4">
					<p>Choose your preferred character set:</p>
					<!-- Add character preference options here -->
				</div>
			</div>

			<div class="rounded-lg bg-white p-6 shadow-md">
				<h2 class="mb-4 text-xl font-semibold">RWP Information</h2>
				<p>Set your personal context for Relevant World Practice:</p>
				<!-- Add RWP preferences form fields here -->
			</div>
		</div>

		<div class="mt-6">
			<button
				on:click={handleSignOut}
				class="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
			>
				Sign Out
			</button>
		</div>
	{:else}
		<div class="flex h-32 items-center justify-center">
			<div
				class="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"
			></div>
		</div>
	{/if}
</div>
