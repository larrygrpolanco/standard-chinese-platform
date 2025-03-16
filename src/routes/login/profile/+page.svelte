<!-- src/routes/profile/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { goto } from '$app/navigation';
	import { getUserPreferences, saveUserPreferences } from '$lib/supabase/client';
	import ModuleQuestions from '$lib/components/ModuleQuestions.svelte';
	import Toast from '$lib/components/UI/Toast.svelte';

	let user = null;
	let userPreferences = null;
	let loading = true;
	let activeModule = 1;
	let isSaving = false;

	// Toast state
	let toastVisible = false;
	let toastMessage = '';
	let toastType = 'success';

	// Form fields
	let fullName = '';
	let learningLevel = '';
	let learningGoals = '';
	let personalContext = {};

	// Define core modules for navigation
	const coreModules = [
		{ id: 1, title: 'ORN', fullTitle: 'Orientation' },
		{ id: 2, title: 'BIO', fullTitle: 'Biography' },
		{ id: 3, title: 'MON', fullTitle: 'Money' },
		{ id: 4, title: 'DIR', fullTitle: 'Directions' },
		{ id: 5, title: 'TRN', fullTitle: 'Transportation' },
		{ id: 6, title: 'MTG', fullTitle: 'Meetings' },
		{ id: 7, title: 'SOC', fullTitle: 'Society' },
		{ id: 8, title: 'TVL', fullTitle: 'Travel' },
		{ id: 9, title: 'LIC', fullTitle: 'Living' }
	];

	// Basic personal context questions
	const personalContextQuestions = [
		{ id: 'location', question: 'Where do you live?' },
		{ id: 'occupation', question: 'What is your occupation?' },
		{ id: 'hobbies', question: 'What are your hobbies or interests?' },
		{ id: 'reason_learning', question: 'Why are you learning Chinese?' }
	];

	// Expand/collapse state
	let isPersonalContextOpen = false;
	let isModuleResponsesOpen = false;

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

			// Initialize form values
			fullName = userPreferences.full_name || '';
			learningLevel = userPreferences.learning_level || '';
			learningGoals = userPreferences.learning_goals || '';
			personalContext = userPreferences.personal_context || {};

			loading = false;
		} catch (error) {
			console.error('Error loading preferences:', error);
			loading = false;
			showToast('Failed to load preferences', 'error');
		}
	});

	async function saveBasicInfo() {
		try {
			isSaving = true;

			await saveUserPreferences({
				...userPreferences,
				full_name: fullName,
				learning_level: learningLevel,
				learning_goals: learningGoals
			});

			showToast('Profile saved successfully');
		} catch (error) {
			console.error('Error saving preferences:', error);
			showToast('Failed to save preferences', 'error');
		} finally {
			isSaving = false;
		}
	}

	async function savePersonalContext() {
		try {
			isSaving = true;

			await saveUserPreferences({
				...userPreferences,
				personal_context: personalContext
			});

			showToast('Personal context saved successfully');
		} catch (error) {
			console.error('Error saving personal context:', error);
			showToast('Failed to save personal context', 'error');
		} finally {
			isSaving = false;
		}
	}

	async function handleModuleQuestionSave(event) {
		try {
			isSaving = true;

			const updatedResponses = event.detail;

			await saveUserPreferences({
				...userPreferences,
				module_responses: updatedResponses
			});

			userPreferences.module_responses = updatedResponses;
			showToast('Module responses saved successfully');
		} catch (error) {
			console.error('Error saving module responses:', error);
			showToast('Failed to save module responses', 'error');
		} finally {
			isSaving = false;
		}
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
</script>

<div class="profile-container">
	<h1 class="page-title">Your Profile</h1>

	{#if loading}
		<div class="loader-container">
			<div class="vintage-loader"></div>
		</div>
	{:else if user}
		<div class="profile-section">
			<h2 class="section-title">Account Information</h2>
			<p class="info-item"><strong>Email:</strong> {user.email}</p>

			{#if user.last_sign_in_at}
				<p class="info-item">
					<strong>Last Sign In:</strong>
					{new Date(user.last_sign_in_at).toLocaleString()}
				</p>
			{/if}
		</div>

		<!-- Basic Info Section -->
		<div class="profile-section">
			<h2 class="section-title">Learning Profile</h2>

			<div class="form-group">
				<label for="fullName">Full Name</label>
				<input type="text" id="fullName" bind:value={fullName} class="form-input" maxlength="50" />
			</div>

			<div class="form-group">
				<label for="learningLevel">Learning Level</label>
				<input
					type="text"
					id="learningLevel"
					bind:value={learningLevel}
					class="form-input"
					maxlength="50"
					placeholder="Beginner, Intermediate, etc."
				/>
			</div>

			<div class="form-group">
				<label for="learningGoals">Learning Goals</label>
				<textarea
					id="learningGoals"
					bind:value={learningGoals}
					class="form-textarea"
					maxlength="500"
					placeholder="What do you hope to achieve by learning Chinese?"
					rows="3"
				></textarea>
			</div>

			<button on:click={saveBasicInfo} class="tape-button save" disabled={isSaving}>
				{isSaving ? 'Saving...' : 'Save Profile'}
			</button>
		</div>

		<!-- Personal Context Section (Collapsible) -->
		<div class="profile-section">
			<button
				class="collapsible-header"
				on:click={() => (isPersonalContextOpen = !isPersonalContextOpen)}
			>
				<h2 class="section-title">Personal Context</h2>
				<span class="toggle-icon">{isPersonalContextOpen ? '−' : '+'}</span>
			</button>

			{#if isPersonalContextOpen}
				<div class="collapsible-content">
					<p class="context-intro">
						Tell us a bit about yourself to help personalize your learning experience. You can also
						create a character if you prefer not to use your personal information.
					</p>

					{#each personalContextQuestions as question}
						<div class="form-group">
							<label for={question.id}>{question.question}</label>
							<textarea
								id={question.id}
								bind:value={personalContext[question.id]}
								class="form-textarea"
								maxlength="50"
								rows="2"
							></textarea>
							<div
								class="char-count {personalContext[question.id]?.length >= 45 ? 'near-limit' : ''}"
							>
								{personalContext[question.id]?.length || 0}/50
							</div>
						</div>
					{/each}

					<button on:click={savePersonalContext} class="tape-button save" disabled={isSaving}>
						{isSaving ? 'Saving...' : 'Save Context'}
					</button>
				</div>
			{/if}
		</div>

		<!-- Module Responses Section (Collapsible) -->
		<div class="profile-section">
			<button
				class="collapsible-header"
				on:click={() => (isModuleResponsesOpen = !isModuleResponsesOpen)}
			>
				<h2 class="section-title">Module Responses</h2>
				<span class="toggle-icon">{isModuleResponsesOpen ? '−' : '+'}</span>
			</button>

			{#if isModuleResponsesOpen}
				<div class="collapsible-content">
					<p class="context-intro">
						These questions help personalize your exercises for each module.
					</p>

					<div class="module-selector">
						{#each coreModules as module}
							<button
								class="module-button {activeModule === module.id ? 'active' : ''}"
								on:click={() => (activeModule = module.id)}
							>
								{module.title}
							</button>
						{/each}
					</div>

					<div class="module-questions-container">
						<h3 class="module-title">{coreModules.find((m) => m.id === activeModule).fullTitle}</h3>
						<!-- Add the key to force rerender when module changes -->
						<ModuleQuestions
							moduleId={activeModule}
							moduleResponses={userPreferences.module_responses || {}}
							on:save={handleModuleQuestionSave}
							key={activeModule}
						/>
					</div>
				</div>
			{/if}
		</div>

		<div class="actions">
			<button on:click={handleSignOut} class="tape-button signout"> Sign Out </button>
		</div>
	{:else}
		<div class="loader-container">
			<div class="vintage-loader"></div>
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

	.profile-section {
		margin-bottom: 1.5rem;
		padding: 1.5rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 0.5rem;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.section-title {
		margin-bottom: 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
	}

	.info-item {
		margin-bottom: 0.5rem;
		font-family: 'Work Sans', sans-serif;
		color: #33312e;
	}

	.form-group {
		margin-bottom: 1rem;
		position: relative;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #33312e;
	}

	.form-input,
	.form-textarea {
		width: 100%;
		padding: 0.75rem;
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 0.25rem;
		font-family: 'Work Sans', sans-serif;
		color: #33312e;
	}

	.form-textarea {
		resize: vertical;
	}

	.char-count {
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		font-size: 0.75rem;
		color: #70594a;
	}

	.near-limit {
		color: #c17c74;
		font-weight: 600;
	}

	.collapsible-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 0;
		background: none;
		border: none;
		cursor: pointer;
		text-align: left;
	}

	.toggle-icon {
		font-size: 1.5rem;
		font-weight: bold;
		color: #826d5b;
	}

	.collapsible-content {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #a0998a;
	}

	.context-intro {
		margin-bottom: 1rem;
		font-size: 0.875rem;
		color: #5c574f;
	}

	.module-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.module-button {
		padding: 0.5rem 0.75rem;
		background-color: #d9d4c5;
		border: 1px solid #a0998a;
		border-radius: 0.25rem;
		font-family: 'Work Sans', sans-serif;
		font-weight: 500;
		color: #33312e;
		cursor: pointer;
	}

	.module-button.active {
		background-color: #c17c74;
		color: #f4f1de;
	}

	.module-questions-container {
		padding: 1rem;
		background-color: #f4f1de;
		border-radius: 0.25rem;
	}

	.module-title {
		margin-bottom: 0.75rem;
		font-family: 'Arvo', serif;
		font-size: 1.125rem;
		font-weight: 600;
		color: #33312e;
	}

	.actions {
		margin-top: 1.5rem;
	}

	.tape-button {
		padding: 0.75rem 1.25rem;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		color: #f4f1de;
		border: none;
		border-radius: 9999px;
		box-shadow: 0 2px 0 #826d5b;
		transition: all 0.2s;
		cursor: pointer;
	}

	.tape-button:hover {
		filter: brightness(0.95);
	}

	.tape-button:active {
		transform: translateY(2px);
		box-shadow: 0 0 0 #826d5b;
	}

	.tape-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.save {
		background-color: #826d5b;
	}

	.save:hover {
		background-color: #70594a;
	}

	.signout {
		background-color: #c17c74;
	}

	.signout:hover {
		background-color: #ad6c66;
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
		border: 4px solid #e8e5d7;
		border-top-color: #c17c74;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 640px) {
		.module-selector {
			justify-content: center;
		}

		.module-button {
			flex: 0 0 calc(20% - 0.5rem);
			text-align: center;
			padding: 0.5rem 0.25rem;
		}
	}
</style>
