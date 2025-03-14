<!-- src/routes/login/+page.svelte -->
<script>
	import Auth from '$lib/components/Auth.svelte';
	import { authStore } from '$lib/stores/authStore';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// If user is already logged in, redirect to home
		const unsubscribe = authStore.subscribe((user) => {
			if (user) {
				goto('/');
			}
		});

		return unsubscribe;
	});
</script>

<div class="container mx-auto px-4 py-12">
	<h1 class="mb-8 text-center text-3xl font-bold">Account Access</h1>
	<Auth />
</div>
