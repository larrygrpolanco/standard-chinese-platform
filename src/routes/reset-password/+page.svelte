<!-- src/routes/reset-password/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase/client';
	import { goto } from '$app/navigation';

	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let message = '';
	let resetToken = '';

	onMount(() => {
		// Get the reset token from the URL
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);
		resetToken = params.get('access_token');

		if (!resetToken) {
			error = 'Invalid or missing reset token. Please try the reset password process again.';
		}
	});

	async function handleResetPassword() {
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		loading = true;
		error = '';
		message = '';

		try {
			const { error: resetError } = await supabase.auth.updateUser({
				password: password
			});

			if (resetError) throw resetError;

			message = 'Password has been reset successfully';
			setTimeout(() => {
				goto('/login');
			}, 2000);
		} catch (e) {
			console.error('Reset error:', e);
			error = e.message || 'Failed to reset password';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Reset Password | Taped Chinese</title>
	<meta name="description" content="Reset your Taped Chinese account password" />
</svelte:head>

<div class="reset-page">
	<div class="reset-container">
		<div class="reset-form">
			<h1 class="form-title">Reset Your Password</h1>

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

			{#if !message && resetToken}
				<form on:submit|preventDefault={handleResetPassword} class="form-fields">
					<div class="form-group">
						<label for="password">New Password</label>
						<input
							type="password"
							id="password"
							bind:value={password}
							required
							autocomplete="new-password"
						/>
					</div>

					<div class="form-group">
						<label for="confirmPassword">Confirm New Password</label>
						<input
							type="password"
							id="confirmPassword"
							bind:value={confirmPassword}
							required
							autocomplete="new-password"
						/>
					</div>

					<button type="submit" disabled={loading} class="tape-button">
						{loading ? 'Resetting...' : 'Reset Password'}
					</button>
				</form>
			{/if}

			<div class="back-link">
				<a href="/login" class="tape-link">Back to Login</a>
			</div>
		</div>
	</div>
</div>

<style>
	.reset-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: calc(100vh - 4rem);
		padding: 2rem 1rem;
		background-image:
			radial-gradient(circle at 15% 50%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 85% 30%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
	}

	.reset-container {
		width: 100%;
		max-width: 28rem;
	}

	.reset-form {
		width: 100%;
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

	.form-fields {
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

	.back-link {
		margin-top: 1.5rem;
		text-align: center;
	}

	.tape-link {
		color: #34667f;
		text-decoration: none;
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		transition: all 0.2s;
	}

	.tape-link:hover {
		background-color: rgba(221, 185, 103, 0.2);
		color: #c17c74;
	}
</style>
