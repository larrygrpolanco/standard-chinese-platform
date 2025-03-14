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

    async function handleSignOut() {
        try {
            await authStore.signOut();
            goto('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }
</script>

<div class="profile-container">
	<h1 class="page-title">Your Profile</h1>

	{#if user}
		<div class="profile-section">
			<h2 class="section-title">Account Information</h2>
			<p class="info-item"><strong>Email:</strong> {user.email}</p>

			<!-- Optional properties that might not exist, add conditionals -->
			{#if user.last_sign_in_at}
				<p class="info-item">
					<strong>Last Sign In:</strong>
					{new Date(user.last_sign_in_at).toLocaleString()}
				</p>
			{/if}
		</div>

		<div class="preferences-container">
			<div class="profile-section">
				<h2 class="section-title">Character Preferences</h2>
				<div class="preference-options">
					<p>Choose your preferred character set:</p>
					<!-- Add character preference options here -->
				</div>
			</div>

			<div class="profile-section">
				<h2 class="section-title">RWP Information</h2>
				<p>Set your personal context for Relevant World Practice:</p>
				<!-- Add RWP preferences form fields here -->
			</div>
		</div>

		<div class="actions">
			<button on:click={handleSignOut} class="tape-button signout">
				Sign Out
			</button>
		</div>
	{:else}
		<div class="loader-container">
			<div class="vintage-loader"></div>
		</div>
	{/if}
</div>

<style>
	.profile-container {
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.page-title {
		margin-bottom: 1.5rem;
		font-family: 'Arvo', serif;
		font-size: 2rem;
		font-weight: bold;
		color: #33312E;
	}

	.profile-section {
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		background-color: #E8E5D7;
		border: 1px solid #A0998A;
		border-radius: 0.5rem;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.section-title {
		margin-bottom: 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312E;
	}

	.info-item {
		margin-bottom: 0.5rem;
		font-family: 'Work Sans', sans-serif;
		color: #33312E;
	}

	.preferences-container {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	@media (min-width: 768px) {
		.preferences-container {
			grid-template-columns: 1fr 1fr;
		}
	}

	.preference-options {
		margin-top: 1rem;
		font-family: 'Work Sans', sans-serif;
	}

	.actions {
		margin-top: 1.5rem;
	}

	.tape-button {
		padding: 0.5rem 1rem;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		color: #F4F1DE;
		border: none;
		border-radius: 9999px;
		box-shadow: 0 2px 0 #826D5B;
		transition: all 0.2s;
		cursor: pointer;
	}
	
	.tape-button:hover {
		filter: brightness(0.95);
	}
	
	.tape-button:active {
		transform: translateY(2px);
		box-shadow: 0 0 0 #826D5B;
	}

	.signout {
		background-color: #C17C74;
	}
	
	.signout:hover {
		background-color: #AD6C66;
	}

	.loader-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 8rem;
	}

	.vintage-loader {
		width: 3rem;
		height: 3rem;
		border-radius: 50%;
		border: 4px solid #E8E5D7;
		border-top-color: #C17C74;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>