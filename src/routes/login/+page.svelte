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

<div class="container mx-auto max-w-2xl px-4 py-12">
	<h1 class="mb-8 text-center font-['Arvo',_serif] text-[2.5rem] font-bold text-[#33312E]">
		Account Access
	</h1>
	<Auth />
</div>