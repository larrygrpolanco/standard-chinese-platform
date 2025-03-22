<!-- src/routes/profile/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { getUserPreferences, saveUserPreferences, getCurrentUser } from '$lib/supabase/client';
	import ModuleQuestions from '$lib/components/ModuleQuestions.svelte';
	import Toast from '$lib/components/UI/Toast.svelte';

	// Tab components
	import AccountTab from '$lib/components/profile/AccountTab.svelte';
	import LearningProfileTab from '$lib/components/profile/LearningProfileTab.svelte';
	import ContextModulesTab from '$lib/components/profile/ContextModulesTab.svelte';
	import FeedbackTab from '$lib/components/profile/FeedbackTab.svelte';
	import Loader from '$lib/components/UI/Loader.svelte';

	let user = null;
	let userPreferences = null;
	let loading = true;

	// Toast state
	let toastVisible = false;
	let toastMessage = '';
	let toastType = 'success';

	// Tab navigation
	const tabs = [
		{ id: 'account', label: 'Account' },
		{ id: 'profile', label: 'Learning Profile' },
		{ id: 'context', label: 'Context & Modules' },
		{ id: 'feedback', label: 'Feedback' }
	];
	let activeTab = 'account';

	// Show a toast notification
	function showToast(message, type = 'success') {
		toastMessage = message;
		toastType = type;
		toastVisible = true;

		// Auto-hide after 3 seconds
		setTimeout(() => {
			toastVisible = false;
		}, 3000);
	}

	async function handleSignOut() {
		try {
			await authStore.signOut();
			goto('/');
		} catch (error) {
			console.error('Error signing out:', error);
			showToast('Failed to sign out', 'error');
		}
	}

	onMount(async () => {
		// Redirect if not logged in
		if (!$authStore) {
			goto('/login');
			return;
		}

		user = $authStore;

		try {
			// Fetch user preferences
			const prefs = await getUserPreferences();
			userPreferences = prefs || {};
			loading = false;
		} catch (error) {
			console.error('Error loading preferences:', error);
			loading = false;
			showToast('Failed to load preferences', 'error');
		}
	});

	// Function to handle tab switching
	function setActiveTab(tabId) {
		activeTab = tabId;
	}
</script>

<div class="profile-container">
	<h1 class="page-title">Your Profile</h1>

	{#if loading}
		<Loader />
	{:else if user}
		<!-- Tab Navigation -->
		<div class="tab-navigation">
			{#each tabs as tab}
				<button
					class="tape-tab {activeTab === tab.id ? 'active' : ''}"
					on:click={() => setActiveTab(tab.id)}
					aria-selected={activeTab === tab.id}
				>
					{tab.label}
				</button>
			{/each}
		</div>

		<!-- Tab Content -->
		<div class="tab-content">
			{#if activeTab === 'account'}
				<AccountTab
					{user}
					{userPreferences}
					on:toast={(e) => showToast(e.detail.message, e.detail.type)}
					on:userUpdated={() => {
						user = $authStore;
					}}
					on:signOut={handleSignOut}
				/>
			{:else if activeTab === 'profile'}
				<LearningProfileTab
					{userPreferences}
					on:toast={(e) => showToast(e.detail.message, e.detail.type)}
					on:preferencesUpdated={(e) => {
						userPreferences = e.detail;
					}}
				/>
			{:else if activeTab === 'context'}
				<ContextModulesTab
					{userPreferences}
					on:toast={(e) => showToast(e.detail.message, e.detail.type)}
					on:preferencesUpdated={(e) => {
						userPreferences = e.detail;
					}}
				/>
			{:else if activeTab === 'feedback'}
				<FeedbackTab {user} on:toast={(e) => showToast(e.detail.message, e.detail.type)} />
			{/if}
		</div>
	{:else}
		<div class="error-message">
			<p>You need to be logged in to view your profile.</p>
			<button class="tape-button" on:click={() => goto('/login')}>Sign In</button>
		</div>
	{/if}
</div>

<!-- Toast notification -->
<Toast message={toastMessage} type={toastType} visible={toastVisible} />

<style>
	.profile-container {
		width: 100%;
		max-width: 48rem;
		margin: 0 auto;
		padding: 1.5rem;
	}

	.page-title {
		margin-bottom: 1.5rem;
		font-family: 'Arvo', serif;
		font-size: 2rem;
		font-weight: bold;
		color: #33312e;
	}

	.tab-navigation {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #e8e5d7;
	}

	.tape-tab {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		font-family: 'Work Sans', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: #33312e;
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 16px;
		transition: all 0.2s;
		cursor: pointer;
	}

	.tape-tab:hover:not(.active) {
		background-color: rgba(221, 185, 103, 0.2);
	}

	.tape-tab.active {
		background-color: #ddb967;
		color: #33312e;
		border-color: #ddb967;
	}

	.tab-content {
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 0.5rem;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
		overflow: hidden;
	}

	.error-message {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 0.5rem;
		text-align: center;
	}

	.tape-button {
		margin-top: 1rem;
		padding: 0.75rem 1.25rem;
		background-color: #826d5b;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		color: #f4f1de;
		border: none;
		border-radius: 9999px;
		box-shadow: 0 2px 0 #70594a;
		transition: all 0.2s;
		cursor: pointer;
	}

	.tape-button:hover {
		filter: brightness(0.95);
	}

	@media (max-width: 640px) {
		.tab-navigation {
			position: sticky;
			top: 0;
			background-color: #f4f1de;
			z-index: 10;
			padding: 0.5rem 0;
			overflow-x: auto;
			white-space: nowrap;
			display: flex;
			flex-wrap: nowrap;
			scrollbar-width: none; /* Firefox */
		}

		.tab-navigation::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Edge */
		}

		.tab-button {
			flex: 0 0 auto;
			font-size: 0.9rem;
			padding: 0.5rem 0.75rem;
		}
	}
</style>
