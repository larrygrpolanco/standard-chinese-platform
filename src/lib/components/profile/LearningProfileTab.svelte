<!-- src/lib/components/profile/LearningProfileTab.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { saveUserPreferences } from '$lib/supabase/client';

	export let userPreferences = {};

	const dispatch = createEventDispatcher();

	// Form fields
	let fullName = userPreferences?.full_name || '';
	let learningLevel = userPreferences?.learning_level || '';
	let learningGoals = userPreferences?.learning_goals || '';

	let isSaving = false;
	let hasChanges = false;

	// Watch for form changes
	$: {
		// Check if any field has changed
		hasChanges =
			fullName !== (userPreferences?.full_name || '') ||
			learningLevel !== (userPreferences?.learning_level || '') ||
			learningGoals !== (userPreferences?.learning_goals || '');
	}

	// Save profile information
	async function saveProfile() {
		try {
			isSaving = true;

			// Create updated preferences object
			const updatedPreferences = {
				...userPreferences,
				full_name: fullName,
				learning_level: learningLevel,
				learning_goals: learningGoals
			};

			// Save to database
			await saveUserPreferences(updatedPreferences);

			// Update the parent component's reference
			dispatch('preferencesUpdated', updatedPreferences);

			// Show success message
			dispatch('toast', {
				message: 'Learning profile saved successfully',
				type: 'success'
			});

			// Reset change tracking
			hasChanges = false;
		} catch (error) {
			console.error('Error saving profile:', error);
			dispatch('toast', {
				message: 'Failed to save profile: ' + error.message,
				type: 'error'
			});
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="learning-profile-tab">
	<section class="profile-section">
		<h2 class="section-title">Your Learning Profile</h2>
		<p class="section-description">
			Tell us about yourself and your learning goals to help personalize your experience.
		</p>

		<div class="form-card">
			<div class="form-group">
				<label for="fullName">Full Name</label>
				<input
					type="text"
					id="fullName"
					bind:value={fullName}
					class="form-input"
					maxlength="50"
					placeholder="Your name (or preferred name)"
				/>
			</div>

			<div class="form-group">
				<label for="learningLevel">Your Chinese Level</label>
				<select id="learningLevel" bind:value={learningLevel} class="form-select">
					<option value="beginner">Beginner</option>
					<option value="intermediate">Intermediate</option>
					<option value="advanced">Advanced</option>
				</select>
				<div class="form-hint">
					This helps us adjust the difficulty of RWP exercises for your level.
				</div>
			</div>

			<div class="form-group">
				<label for="learningGoals">Learning Goals</label>
				<textarea
					id="learningGoals"
					bind:value={learningGoals}
					class="form-textarea"
					maxlength="500"
					placeholder="What do you hope to achieve by learning Chinese? What topics are you most interested in learning?"
					rows="4"
				></textarea>
				<div class="char-count">
					{learningGoals.length}/500
				</div>
			</div>

			<div class="form-actions">
				<button
					class="tape-button {hasChanges ? 'active' : 'inactive'}"
					on:click={saveProfile}
					disabled={isSaving || !hasChanges}
				>
					{isSaving ? 'Saving...' : 'Save Profile'}
				</button>
			</div>
		</div>
	</section>
</div>

<style>
	.learning-profile-tab {
		padding: 1.5rem;
		background-color: var(--color-cream-dark);
		box-shadow:
			inset 0 1px 4px rgba(51, 49, 46, 0.15),
			4px 4px 0 var(--color-shadow);
		overflow: hidden;
		background-image:
			radial-gradient(circle at 15% 50%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 85% 30%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
	}

	.section-title {
		margin-bottom: 0.75rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
	}

	.section-description {
		margin-bottom: 1.5rem;
		color: #a0998a;
		font-family: 'Work Sans', sans-serif;
	}

	.form-card {
		padding: 1.5rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 8px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.form-group {
		margin-bottom: 1.25rem;
		position: relative;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		font-family: 'Work Sans', sans-serif;
		color: #33312e;
	}

	.form-input,
	.form-select,
	.form-textarea {
		width: 100%;
		padding: 0.75rem;
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 8px;
		font-family: 'Work Sans', sans-serif;
		color: #33312e;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: border-color 0.2s;
	}

	.char-count {
		position: absolute;
		right: 0;
		bottom: -1.25rem;
		font-size: 0.75rem;
		font-family: 'Courier New', monospace;
		color: #a0998a;
	}

	.tape-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		color: #33312e;
		background-color: #ddb967;
		border: none;
		border-radius: 16px;
		box-shadow: 0 2px 0 #826d5b;
		transition: all 0.2s;
		cursor: pointer;
	}

	.tape-button.active {
		background-color: #ddb967;
	}

	.tape-button.inactive {
		background-color: #a0998a;
		color: white;
		opacity: 0.7;
		cursor: not-allowed;
	}

	.tape-button:active:not(:disabled) {
		transform: translateY(2px);
		box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 640px) {
		.learning-profile-tab {
			padding: 1rem;
		}

		.form-card {
			padding: 1rem;
		}
	}
</style>
