<!-- src/lib/components/profile/FeedbackTab.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { saveUserPreferences, getCurrentUser } from '$lib/supabase/client';

	export let user;

	const dispatch = createEventDispatcher();

	let feedbackText = '';
	let contactEmail = user?.email || '';
	let submitting = false;
	let feedbackSubmitted = false;

	async function submitFeedback() {
		if (!feedbackText) return;

		try {
			submitting = true;

			// For now, we'll just save feedback to user_preferences.feedback
			// In a real implementation, you might want to create a dedicated feedback table

			// Get current user preferences
			const currentUser = await getCurrentUser();

			// Save feedback
			await saveUserPreferences({
				feedback: {
					text: feedbackText,
					contact: contactEmail,
					date: new Date().toISOString()
				}
			});

			// Show success message
			dispatch('toast', {
				message: 'Thank you for your feedback!',
				type: 'success'
			});

			// Reset form and show thank you message
			feedbackSubmitted = true;
		} catch (error) {
			console.error('Error submitting feedback:', error);
			dispatch('toast', {
				message: 'Failed to submit feedback: ' + error.message,
				type: 'error'
			});
		} finally {
			submitting = false;
		}
	}

	function resetFeedbackForm() {
		feedbackText = '';
		feedbackSubmitted = false;
	}
</script>

<div class="feedback-tab">
	<section class="feedback-section">
		<h2 class="section-title">Feedback & Support</h2>

		{#if !feedbackSubmitted}
			<p class="section-description">
				Your feedback helps improve this website for everyone. Let us know what you think!
			</p>

			<div class="form-card">
				<div class="form-group">
					<label for="feedbackText">Your Feedback</label>
					<textarea
						id="feedbackText"
						bind:value={feedbackText}
						class="form-textarea"
						maxlength="1000"
						rows="6"
						placeholder="Tell us what you like about the site, what could be improved, or what features you'd like to see."
					></textarea>
					<div class="char-count">
						{feedbackText.length}/1000
					</div>
				</div>

				<div class="form-group">
					<label for="contactEmail">Contact Email (optional)</label>
					<input
						type="email"
						id="contactEmail"
						bind:value={contactEmail}
						class="form-input"
						placeholder="We'll only use this to follow up on your feedback if needed"
					/>
					<div class="form-hint">Leave this blank if you prefer to stay anonymous.</div>
				</div>

				<div class="form-actions">
					<button
						class="tape-button {feedbackText ? 'active' : 'inactive'}"
						on:click={submitFeedback}
						disabled={submitting || !feedbackText}
					>
						{submitting ? 'Submitting...' : 'Submit Feedback'}
					</button>
				</div>
			</div>
		{:else}
			<div class="thank-you-message">
				<div class="thank-you-icon">✓</div>
				<h3>Thank You for Your Feedback!</h3>
				<p>
					We appreciate you taking the time to share your thoughts. Your feedback helps us improve
					the Chinese learning experience for everyone.
				</p>
				<button class="tape-button secondary" on:click={resetFeedbackForm}>
					Submit Another Comment
				</button>
			</div>
		{/if}
	</section>

	<section class="support-section">
		<h2 class="section-title">About Subscriptions</h2>

		<div class="support-card">
			<div class="support-icon">♥</div>
			<h3 class="support-heading">Why Your Support Matters</h3>
			<p class="support-text">
				Taped Chinese was created to make the FSI learning materials accessible to everyone.
				The core course materials will always remain free, but your subscription helps cover server
				costs, development time, and enables new features like the Relevant World Practice (RWP)
				exercises.
			</p>
			<p class="support-text highlight">
				Premium subscribers get unlimited access to RWP exercises, while free users can generate one
				exercise per day.
			</p>
			<div class="support-action">
				<button class="tape-button upgrade">Upgrade to Premium</button>
			</div>
		</div>
	</section>
</div>

<style>
	.feedback-tab {
		padding: 1.5rem;
		/* background-color: var(--color-cream-dark); */
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

	.form-card {
		padding: 1.5rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 8px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.thank-you-message {
		text-align: center;
		padding: 2rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 8px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.thank-you-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		margin: 0 auto 1rem;
		background-color: #7d8c5c;
		color: #f4f1de;
		font-size: 1.5rem;
		border-radius: 50%;
	}

	.support-card {
		padding: 1.5rem;
		background-color: rgba(221, 185, 103, 0.1);
		border: 1px solid #ddb967;
		border-radius: 8px;
		text-align: center;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.support-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		margin: 0 auto 1rem;
		background-color: #ddb967;
		color: #33312e;
		font-size: 1.5rem;
		border-radius: 50%;
	}

	.support-text.highlight {
		padding: 0.75rem;
		background-color: #f4f1de;
		border-radius: 8px;
		font-weight: 500;
		color: #33312e;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.feedback-section,
	.support-section {
		margin-bottom: 2.5rem;
	}

	.section-description {
		margin-bottom: 1.5rem;
		color: #70594a;
	}

	.form-group {
		margin-bottom: 1.5rem;
		position: relative;
	}

	.form-group:last-of-type {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #33312e;
	}

	.form-textarea,
	.form-input {
		width: 100%;
		padding: 0.75rem;
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 0.25rem;
		font-family: 'Work Sans', sans-serif;
		color: #33312e;
		transition: border-color 0.2s;
	}

	.form-textarea {
		resize: vertical;
		min-height: 120px;
	}

	.form-textarea:focus,
	.form-input:focus {
		border-color: #826d5b;
		outline: none;
	}

	.form-hint {
		margin-top: 0.25rem;
		font-size: 0.875rem;
		color: #70594a;
	}

	.char-count {
		position: absolute;
		right: 0;
		bottom: -1.25rem;
		font-size: 0.75rem;
		color: #70594a;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
	}

	.thank-you-message h3 {
		margin-bottom: 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		color: #33312e;
	}

	.thank-you-message p {
		margin-bottom: 1.5rem;
		color: #70594a;
	}

	.support-heading {
		margin-bottom: 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		color: #33312e;
	}

	.support-text {
		margin-bottom: 1rem;
		color: #70594a;
	}

	.support-action {
		margin-top: 1.5rem;
	}

	.tape-button {
		padding: 0.75rem 1.25rem;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		color: #f4f1de;
		border: none;
		border-radius: 9999px;
		box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
		transition: all 0.2s;
		cursor: pointer;
	}

	.tape-button.active {
		background-color: #826d5b;
	}

	.tape-button.inactive {
		background-color: #a0998a;
		opacity: 0.7;
		cursor: not-allowed;
	}

	.tape-button.secondary {
		background-color: #a0998a;
	}

	.tape-button.upgrade {
		background-color: #826d5b;
		padding: 0.75rem 1.5rem;
	}

	.tape-button:hover:not(:disabled) {
		filter: brightness(0.95);
	}

	.tape-button:active:not(:disabled) {
		transform: translateY(2px);
		box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 640px) {
		.feedback-tab {
			padding: 1rem;
		}

		.form-card,
		.thank-you-message,
		.support-card {
			padding: 1rem;
		}
	}
</style>
