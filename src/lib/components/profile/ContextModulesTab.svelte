<!-- src/lib/components/profile/ContextModulesTab.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { slide } from 'svelte/transition';
	import { saveUserPreferences } from '$lib/supabase/client';
	import ModuleQuestions from '$lib/components/ModuleQuestions.svelte';

	export let userPreferences = {};

	const dispatch = createEventDispatcher();

	// Personal context state - ensure we're working with a proper copy, not reference
	let personalContext = { ...(userPreferences?.personal_context || {}) };
	let personalContextChanged = false;
	let savingContext = false;

	// Module responses
	let activeModule = 1;
	let savingModuleResponses = false;

	// Collapse state variables
	let isPersonalContextCollapsed = true;
	let isModuleContextCollapsed = true;

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

	// Toggle collapse state
	function togglePersonalContext() {
		isPersonalContextCollapsed = !isPersonalContextCollapsed;
	}

	function toggleModuleContext() {
		isModuleContextCollapsed = !isModuleContextCollapsed;
	}

	// Watch for personal context changes
	$: {
		// Compare current personal context with original
		const original = JSON.stringify(userPreferences?.personal_context || {});
		const current = JSON.stringify(personalContext);
		personalContextChanged = original !== current;
	}

	// Update a specific field in personal context
	function updatePersonalContext(id, value) {
		personalContext[id] = value;
		// Force reactivity update
		personalContext = { ...personalContext };
	}

	// Save personal context
	async function savePersonalContext() {
		try {
			savingContext = true;

			// Create updated preferences object
			const updatedPreferences = {
				...userPreferences,
				personal_context: personalContext
			};

			// Save to database
			await saveUserPreferences(updatedPreferences);

			// Update the parent component's reference
			dispatch('preferencesUpdated', updatedPreferences);

			// Show success message
			dispatch('toast', {
				message: 'Personal context saved successfully',
				type: 'success'
			});

			// Reset change tracking
			personalContextChanged = false;
		} catch (error) {
			console.error('Error saving personal context:', error);
			dispatch('toast', {
				message: 'Failed to save personal context: ' + error.message,
				type: 'error'
			});
		} finally {
			savingContext = false;
		}
	}

	// Handle module responses save
	async function handleModuleQuestionSave(event) {
		try {
			savingModuleResponses = true;

			const updatedResponses = event.detail;

			// Create updated preferences object
			const updatedPreferences = {
				...userPreferences,
				module_responses: updatedResponses
			};

			// Save to database
			await saveUserPreferences(updatedPreferences);

			// Update the parent component's reference
			dispatch('preferencesUpdated', updatedPreferences);

			// Show success message
			dispatch('toast', {
				message: 'Module responses saved successfully',
				type: 'success'
			});
		} catch (error) {
			console.error('Error saving module responses:', error);
			dispatch('toast', {
				message: 'Failed to save module responses: ' + error.message,
				type: 'error'
			});
		} finally {
			savingModuleResponses = false;
		}
	}
</script>

<div class="context-modules-tab">
	<!-- Personal Context Section -->
	<section class="context-section">
		<div
			class="section-header"
			on:click={togglePersonalContext}
			on:keydown={(e) => e.key === 'Enter' && togglePersonalContext()}
			role="button"
			tabindex="0"
		>
			<h2 class="section-title">Personal Context</h2>
			<span class="toggle-icon">{isPersonalContextCollapsed ? '+' : '−'}</span>
		</div>

		{#if !isPersonalContextCollapsed}
			<div class="section-content" transition:slide={{ duration: 300 }}>
				<p class="section-description">
					Tell us about yourself to help personalize your RWP exercises. You can also create a
					fictional character if you prefer not to use your personal information.
				</p>

				<div class="form-card">
					<div class="module-questions">
						<p class="helper-text">
							Your answers help the exercises use your interests and experiences.
						</p>

						{#each personalContextQuestions as question (question.id)}
							<div class="question-card">
								<label for={question.id} class="question-label">
									{question.question}
								</label>
								<div class="input-wrapper">
									<textarea
										id={question.id}
										value={personalContext[question.id] || ''}
										on:input={(e) => updatePersonalContext(question.id, e.target.value)}
										class="question-input"
										rows="2"
										maxlength="200"
										placeholder="Your answer here..."
									></textarea>
									<div
										class="char-count {(personalContext[question.id]?.length || 0) >= 180
											? 'near-limit'
											: ''}"
									>
										{personalContext[question.id]?.length || 0}/200
									</div>
								</div>
							</div>
						{/each}

						<button
							on:click={savePersonalContext}
							class="vintage-button {!personalContextChanged || savingContext ? 'disabled' : ''}"
							disabled={!personalContextChanged || savingContext}
						>
							<span class="button-text">
								{savingContext ? 'Saving...' : 'Save Context'}
							</span>
						</button>
					</div>
				</div>
			</div>
		{/if}
	</section>

	<!-- Module Responses Section -->
	<section class="module-section">
		<div
			class="section-header"
			on:click={toggleModuleContext}
			on:keydown={(e) => e.key === 'Enter' && toggleModuleContext()}
			role="button"
			tabindex="0"
		>
			<h2 class="section-title">Module Context</h2>
			<span class="toggle-icon">{isModuleContextCollapsed ? '+' : '−'}</span>
		</div>

		{#if !isModuleContextCollapsed}
			<div class="section-content" transition:slide={{ duration: 300 }}>
				<p class="section-description">
					You can answers these questions as you complete modules, but they are all here to make it easier to edit.
				</p>

				<div class="module-container">
					<div class="module-selector">
						{#each coreModules as module}
							<button
								class="tape-tab {activeModule === module.id ? 'active' : ''}"
								on:click={() => (activeModule = module.id)}
								aria-label={`Select ${module.fullTitle} module`}
							>
								{module.title}
							</button>
						{/each}
					</div>

					<div class="module-content">
						<h3 class="module-title">{coreModules.find((m) => m.id === activeModule).fullTitle}</h3>

						<div class="module-questions-container">
							<ModuleQuestions
								moduleId={activeModule}
								moduleResponses={userPreferences.module_responses || {}}
								on:save={handleModuleQuestionSave}
								key={activeModule}
								loading={savingModuleResponses}
							/>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</section>
</div>

<style>
	.context-modules-tab {
		padding: 1.5rem;
		box-shadow:
			inset 0 1px 4px rgba(51, 49, 46, 0.15),
			4px 4px 0 var(--color-shadow);
		overflow: hidden;
		background-image:
			radial-gradient(circle at 15% 50%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 85% 30%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
	}

	.context-section,
	.module-section {
		margin-bottom: 2rem;
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 8px;
		overflow: hidden;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.5rem;
		background-color: #e8e5d7;
		border-bottom: 1px solid #a0998a;
		cursor: pointer;
		user-select: none;
		transition: background-color 0.2s;
	}

	.section-header:hover {
		background-color: #ddd9c9;
	}

	.section-title {
		margin: 0;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
	}

	.toggle-icon {
		font-size: 1.5rem;
		font-weight: bold;
		color: #70594a;
		transition: transform 0.3s;
	}

	.section-content {
		padding: 1.5rem;
	}

	.section-description {
		margin-bottom: 1.5rem;
		color: #70594a;
	}

	.form-card,
	.module-container {
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 8px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
		overflow: hidden;
	}

	.form-card {
		padding: 1.5rem;
	}

	.module-questions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: 'Work Sans', sans-serif;
	}

	.helper-text {
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0 0 0.5rem 0;
	}

	.question-card {
		background-color: var(--color-cream-paper, #f4f1de);
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.01));
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 6px;
		padding: 0.75rem;
		margin-bottom: 1rem;
	}

	.question-label {
		display: block;
		font-weight: 500;
		color: var(--color-charcoal, #33312e);
		margin-bottom: 0.5rem;
		font-size: 0.9375rem;
	}

	.input-wrapper {
		position: relative;
		background-color: white;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 4px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.input-wrapper:focus-within {
		border-color: var(--color-gold, #ddb967);
		box-shadow: 0 0 0 3px rgba(221, 185, 103, 0.2);
	}

	.question-input {
		width: 100%;
		padding: 0.625rem;
		padding-right: 3.5rem; /* Space for character count */
		background-color: transparent;
		border: none;
		font-family: inherit;
		font-size: 0.875rem;
		color: var(--color-charcoal, #33312e);
		resize: vertical;
	}

	.question-input:focus {
		outline: none;
	}

	.question-input::placeholder {
		color: rgba(160, 152, 138, 0.6);
		font-style: italic;
	}

	.char-count {
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		font-size: 0.75rem;
		font-family: 'Courier New', monospace;
		color: var(--color-warm-gray, #a0998a);
		background-color: rgba(255, 255, 255, 0.8);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
	}

	.near-limit {
		color: var(--color-terracotta, #c17c74);
		font-weight: 600;
	}

	.vintage-button {
		position: relative;
		align-self: flex-end;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-terracotta, #c17c74);
		color: white;
		border: none;
		border-radius: 24px;
		padding: 0.625rem 1.25rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 3px 0 var(--color-terracotta-hover, #ad6c66);
		transform: translateY(0);
	}

	.vintage-button:hover:not(.disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 0 var(--color-terracotta-hover, #ad6c66);
		background-color: #b06b64;
	}

	.vintage-button:active:not(.disabled) {
		transform: translateY(3px);
		box-shadow: 0 0 0 var(--color-terracotta-hover, #ad6c66);
	}

	.vintage-button.disabled {
		background-color: #a0998a;
		box-shadow: 0 3px 0 #8a8475;
		opacity: 0.7;
		cursor: not-allowed;
	}

	.button-text {
		position: relative;
		z-index: 1;
	}

	.module-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		padding: 1rem;
		background-color: #d9d4c5;
		border-bottom: 1px solid #a0998a;
	}

	.tape-tab {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.75rem;
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

	.module-content {
		padding: 1.5rem;
	}

	.module-title {
		margin-bottom: 1.25rem;
		font-family: 'Arvo', serif;
		font-size: 1.125rem;
		font-weight: 600;
		color: #33312e;
		text-align: center;
	}

	.module-questions-container {
		background-color: #f4f1de;
		border-radius: 0.25rem;
		padding: 1rem;
	}

	@media (max-width: 640px) {
		.context-modules-tab {
			padding: 1rem;
		}

		.form-card {
			padding: 1rem;
		}

		.module-selector {
			flex-wrap: nowrap;
			overflow-x: auto;
			padding: 0.75rem;
			scrollbar-width: none; /* Firefox */
		}

		.module-selector::-webkit-scrollbar {
			display: none; /* Chrome, Safari, Edge */
		}

		.tape-tab {
			flex: 0 0 auto;
			font-size: 0.75rem;
			padding: 0.375rem 0.5rem;
		}

		.module-content {
			padding: 1rem;
		}

		.vintage-button {
			align-self: center;
			width: 100%;
		}
	}
</style>
