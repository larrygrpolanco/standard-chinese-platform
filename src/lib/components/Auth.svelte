<!-- src/lib/components/Auth.svelte -->
<script>
	import { signIn, signUp } from '$lib/supabase/client.js';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let isRegister = false;
	let loading = false;
	let error = '';

	// Initialize auth store when component mounts
	onMount(() => {
		authStore.initialize();
	});

	async function handleSubmit() {
		error = '';
		loading = true;

		if (!email || !password) {
			error = 'Email and password are required';
			loading = false;
			return;
		}

		try {
			if (isRegister) {
				if (password !== confirmPassword) {
					error = "Passwords don't match";
					loading = false;
					return;
				}
				await signUp(email, password);
				alert('Check your email to confirm your account');
			} else {
				await signIn(email, password);
				goto('/'); // Redirect to home after login
			}
		} catch (e) {
			console.error('Auth error:', e);
			error = e.message || 'Authentication error';
		} finally {
			loading = false;
		}
	}
</script>

<div class="auth-form mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md">
	<h2 class="mb-6 text-center text-2xl font-bold">{isRegister ? 'Create Account' : 'Sign In'}</h2>

	{#if error}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			{error}
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-4">
		<div class="form-group">
			<label for="email" class="mb-1 block text-sm font-medium text-gray-700">Email</label>
			<input
				type="email"
				id="email"
				bind:value={email}
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
			/>
		</div>

		<div class="form-group">
			<label for="password" class="mb-1 block text-sm font-medium text-gray-700">Password</label>
			<input
				type="password"
				id="password"
				bind:value={password}
				required
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
			/>
		</div>

		{#if isRegister}
			<div class="form-group">
				<label for="confirmPassword" class="mb-1 block text-sm font-medium text-gray-700"
					>Confirm Password</label
				>
				<input
					type="password"
					id="confirmPassword"
					bind:value={confirmPassword}
					required
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
				/>
			</div>
		{/if}

		<button
			type="submit"
			disabled={loading}
			class="w-full rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
		>
			{loading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
		</button>
	</form>

	<div class="mt-4 text-center">
		<button
			on:click={() => (isRegister = !isRegister)}
			class="text-indigo-600 hover:text-indigo-500"
		>
			{isRegister ? 'Already have an account? Sign In' : 'Need an account? Register'}
		</button>
	</div>
</div>
