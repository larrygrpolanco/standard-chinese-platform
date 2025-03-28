<!-- src/lib/components/Auth.svelte -->
<script>
	import { signIn, signUp, resetPassword, signInWithGoogle } from '$lib/supabase/client.js';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let confirmPassword = '';
	let isRegister = false;
	let isForgotPassword = false;
	let loading = false;
	let error = '';
	let message = '';

	// Initialize auth store when component mounts
	onMount(() => {
		authStore.initialize();
	});

	async function handleGoogleSignIn() {
		error = '';
		message = '';
		loading = true;

		try {
			await signInWithGoogle();
			// No need to redirect, OAuth will handle it
		} catch (e) {
			console.error('Google sign-in error:', e);
			error = e.message || 'Authentication error';
			loading = false;
		}
	}

	async function handleSubmit() {
		error = '';
		message = '';
		loading = true;

		try {
			if (isForgotPassword) {
				if (!email) {
					error = 'Email is required';
					loading = false;
					return;
				}

				await resetPassword(email);
				message = 'Password reset instructions sent to your email';
				// Stay on forgot password view so user can see the message
			} else if (isRegister) {
				if (!email || !password) {
					error = 'Email and password are required';
					loading = false;
					return;
				}

				if (password !== confirmPassword) {
					error = "Passwords don't match";
					loading = false;
					return;
				}

				await signUp(email, password);
				message = 'Check your email to confirm your account';
			} else {
				if (!email || !password) {
					error = 'Email and password are required';
					loading = false;
					return;
				}

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

	function switchMode(mode) {
		error = '';
		message = '';

		if (mode === 'login') {
			isRegister = false;
			isForgotPassword = false;
		} else if (mode === 'register') {
			isRegister = true;
			isForgotPassword = false;
		} else if (mode === 'forgot') {
			isForgotPassword = true;
			isRegister = false;
		}
	}
</script>

<div class="auth-container">
	<div class="auth-form">
		<h2 class="form-title">
			{#if isForgotPassword}
				Reset Password
			{:else if isRegister}
				Create Account
			{:else}
				Sign In
			{/if}
		</h2>

		{#if error}
			<div class="error-message" role="alert">
				{error}
			</div>
		{/if}

		{#if message}
			<div class="success-message" role="status">
				{message}
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="auth-form-fields">
			<div class="form-group">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					bind:value={email}
					required
					autocomplete={isRegister ? 'email' : 'username'}
				/>
			</div>

			{#if !isForgotPassword}
				<div class="form-group">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						bind:value={password}
						required={!isForgotPassword}
						autocomplete={isRegister ? 'new-password' : 'current-password'}
					/>
				</div>
			{/if}

			{#if isRegister}
				<div class="form-group">
					<label for="confirmPassword">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						bind:value={confirmPassword}
						required
						autocomplete="new-password"
					/>
				</div>
			{/if}

			<button type="submit" disabled={loading} class="tape-button">
				{#if loading}
					<span class="loader"></span>
					<span>Processing...</span>
				{:else if isForgotPassword}
					Send Reset Instructions
				{:else if isRegister}
					Register
				{:else}
					Sign In
				{/if}
			</button>
		</form>

        <div class="auth-divider">
				<span>Or</span>
			</div>

			<button type="button" on:click={handleGoogleSignIn} class="google-button" disabled={loading}>
				<svg viewBox="0 0 24 24" width="18" height="18">
					<path
						d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"
						fill="#4285F4"
					/>
				</svg>
				Sign in with Google
			</button>

		<div class="auth-footer">
			{#if !isForgotPassword}
				<div class="toggle-mode">
					<button
						type="button"
						on:click={() => switchMode(isRegister ? 'login' : 'register')}
						class="toggle-button"
					>
						{isRegister ? 'Already have an account? Sign In' : 'Need an account? Register'}
					</button>
				</div>
			{/if}

			

			<div class="forgot-password">
				{#if !isForgotPassword && !isRegister}
					<button type="button" on:click={() => switchMode('forgot')} class="forgot-button">
						Forgot your password?
					</button>
				{:else if isForgotPassword || isRegister}
					<button type="button" on:click={() => switchMode('login')} class="back-button">
						Back to Sign In
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>

<style>
	.auth-container {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		margin-bottom: 2rem;
	}

	.auth-form {
		width: 100%;
		max-width: 28rem;
		margin: 0 auto;
		padding: 1.5rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 0.5rem;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.form-title {
		margin-bottom: 1.5rem;
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		font-weight: bold;
		text-align: center;
		color: #33312e;
	}

	.error-message {
		margin-bottom: 1rem;
		padding: 0.75rem 1rem;
		background-color: #f4f1de;
		border: 1px solid #c17c74;
		border-radius: 0.25rem;
		color: #c17c74;
	}

	.success-message {
		margin-bottom: 1rem;
		padding: 0.75rem 1rem;
		background-color: #f4f1de;
		border: 1px solid #34667f;
		border-radius: 0.25rem;
		color: #34667f;
	}

	.auth-form-fields {
		font-family: 'Work Sans', sans-serif;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
	}

	.form-group input {
		width: 100%;
		padding: 0.5rem 0.75rem;
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 0.375rem;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
	}

	.form-group input:focus {
		outline: none;
		border-color: #ddb967;
		box-shadow: 0 0 0 2px rgba(221, 185, 103, 0.2);
	}

	.tape-button {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background-color: #c17c74;
		color: #f4f1de;
		font-weight: 600;
		border: none;
		border-radius: 9999px;
		box-shadow: 0 2px 0 #826d5b;
		transition: all 0.2s;
	}

	.tape-button:hover:not(:disabled) {
		background-color: #ad6c66;
	}

	.tape-button:active {
		transform: translateY(2px);
		box-shadow: 0 0 0 #826d5b;
	}

	.tape-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.auth-footer {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.toggle-mode,
	.forgot-password {
		text-align: center;
	}

	.toggle-button,
	.forgot-button,
	.back-button {
		padding: 0.5rem 1rem;
		color: #34667f;
		border: none;
		background: transparent;
		border-radius: 9999px;
		transition: all 0.2s;
	}

	.toggle-button:hover,
	.forgot-button:hover,
	.back-button:hover {
		background-color: rgba(221, 185, 103, 0.2);
		color: #c17c74;
	}

	.forgot-button {
		font-size: 0.875rem;
	}

	.loader {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: #f4f1de;
		animation: spin 1s ease-in-out infinite;
	}

	.auth-divider {
		position: relative;
		text-align: center;
		margin: 1.5rem 0;
	}

	.auth-divider:before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 1px;
		background-color: #a0998a;
	}

	.auth-divider span {
		position: relative;
		display: inline-block;
		padding: 0 0.5rem;
		background-color: #e8e5d7;
		color: #826d5b;
		font-size: 0.875rem;
	}

	.google-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.5rem 1rem;
		border: 1px solid #a0998a;
		border-radius: 9999px;
		background-color: #f4f1de;
		color: #33312e;
		font-weight: 600;
		transition: all 0.2s;
	}

	.google-button:hover:not(:disabled) {
		background-color: #eceadd;
	}

	.google-button:active {
		transform: translateY(1px);
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.auth-form {
			padding: 1rem;
		}
	}
</style>
