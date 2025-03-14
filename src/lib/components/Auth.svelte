<!-- src/lib/components/Auth.svelte -->
<!-- src/lib/components/Auth.svelte -->
<script>
	import { signIn, signUp } from '$lib/supabase/client.js';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let isRegister = false;
	let loading = false;
	let error = '';

	async function handleSubmit() {
		error = '';
		loading = true;

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
				const data = await signIn(email, password);
				// The authStore will be updated via the auth state change listener
				goto('/'); // Redirect to home after login
			}
		} catch (e) {
			error = e.message || 'Authentication error';
		} finally {
			loading = false;
		}
	}
</script>

<div class="auth-form">
	<h2>{isRegister ? 'Create Account' : 'Sign In'}</h2>

	{#if error}
		<div class="error">{error}</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-group">
			<label for="email">Email</label>
			<input type="email" bind:value={email} required />
		</div>

		<div class="form-group">
			<label for="password">Password</label>
			<input type="password" bind:value={password} required />
		</div>

		{#if isRegister}
			<div class="form-group">
				<label for="confirm">Confirm Password</label>
				<input type="password" bind:value={confirmPassword} required />
			</div>
		{/if}

		<button type="submit" disabled={loading}>
			{loading ? 'Processing...' : isRegister ? 'Register' : 'Sign In'}
		</button>
	</form>

	<div class="toggle">
		<button on:click={() => (isRegister = !isRegister)}>
			{isRegister ? 'Already have an account? Sign In' : 'Need an account? Register'}
		</button>
	</div>
</div>

<style>
	.auth-form {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
		border: 1px solid #ddd;
		border-radius: 8px;
		background-color: white;
	}
	/* Additional styling omitted for brevity */
</style>
