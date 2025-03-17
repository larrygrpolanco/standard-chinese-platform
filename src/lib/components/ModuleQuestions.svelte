<!-- src/lib/components/ModuleQuestions.svelte -->
<script>
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let moduleId;
	export let moduleResponses = {};

	// Define module-specific questions (5 per module)
	const moduleQuestions = {
		1: [
			{ id: 'preferred_transportation', question: "What's your preferred mode of transportation?" },
			{ id: 'travel_frequency', question: 'How often do you travel?' },
			{ id: 'dream_destination', question: 'Where would you like to travel in China?' },
			{ id: 'travel_purpose', question: 'Why do you usually travel?' },
			{ id: 'travel_companions', question: 'Who do you usually travel with?' }
		],
		2: [
			{ id: 'food_preferences', question: 'What kinds of food do you enjoy?' },
			{ id: 'dining_frequency', question: 'How often do you eat out?' },
			{ id: 'cooking_habits', question: 'Do you cook at home? What do you make?' },
			{ id: 'favorite_restaurant', question: 'Describe your favorite restaurant.' },
			{ id: 'dietary_restrictions', question: 'Do you have any dietary restrictions?' }
		],
		3: [
			{ id: 'spending_habits', question: 'What do you typically spend money on?' },
			{ id: 'shopping_frequency', question: 'How often do you go shopping?' },
			{ id: 'budget_planning', question: 'How do you plan your budget?' },
			{ id: 'financial_goals', question: 'What are your financial goals?' },
			{ id: 'preferred_payment', question: 'What payment methods do you prefer?' }
		],
		4: [
			{ id: 'navigation_method', question: 'How do you typically navigate in new places?' },
			{ id: 'landmark_recognition', question: 'What landmarks do you find easiest to recognize?' },
			{
				id: 'direction_challenges',
				question: 'What challenges do you face when finding directions?'
			},
			{ id: 'favorite_locations', question: 'What places do you visit frequently?' },
			{ id: 'neighborhood_description', question: 'Describe your neighborhood briefly.' }
		],
		5: [
			{ id: 'commute_method', question: 'How do you commute daily?' },
			{ id: 'commute_time', question: 'How long is your typical commute?' },
			{ id: 'traffic_concerns', question: 'What concerns do you have about traffic?' },
			{ id: 'transport_preferences', question: 'What forms of transportation do you prefer?' },
			{ id: 'travel_planning', question: 'How do you plan transportation for trips?' }
		],
		6: [
			{ id: 'meeting_frequency', question: 'How often do you attend meetings?' },
			{ id: 'meeting_preferences', question: 'Do you prefer in-person or virtual meetings?' },
			{ id: 'meeting_contributions', question: 'How do you typically contribute in meetings?' },
			{ id: 'scheduling_habits', question: 'How do you manage your schedule?' },
			{ id: 'appointment_types', question: 'What types of appointments do you regularly have?' }
		],
		7: [
			{ id: 'social_activities', question: 'What social activities do you enjoy?' },
			{ id: 'cultural_interests', question: 'What aspects of culture interest you most?' },
			{ id: 'community_involvement', question: 'How are you involved in your community?' },
			{ id: 'social_challenges', question: 'What social situations do you find challenging?' },
			{ id: 'cultural_experiences', question: 'What cultural experiences would you like to have?' }
		],
		8: [
			{ id: 'travel_frequency', question: 'How often do you travel?' },
			{ id: 'travel_preferences', question: 'Do you prefer domestic or international travel?' },
			{ id: 'travel_companions', question: 'Who do you usually travel with?' },
			{ id: 'travel_planning', question: 'How do you plan your trips?' },
			{ id: 'travel_experiences', question: 'What travel experiences are you seeking?' }
		],
		9: [
			{ id: 'living_situation', question: 'Describe your living situation.' },
			{ id: 'home_preferences', question: 'What do you value most in a home?' },
			{ id: 'daily_routines', question: 'What are your daily routines?' },
			{ id: 'neighborhood_features', question: 'What features do you want in a neighborhood?' },
			{
				id: 'living_challenges',
				question: 'What challenges do you face in your living environment?'
			}
		]
	};

	let questions = [];
	let answers = {};

	// Initialize questions and answers ONLY when module or moduleResponses change
	$: {
		questions = moduleQuestions[moduleId] || [];
		initializeAnswers();
	}

	// Initial setup of answers from moduleResponses
	function initializeAnswers() {
		answers = {};
		questions.forEach((q) => {
			answers[q.id] = moduleResponses[moduleId]?.[q.id] || '';
		});
	}

	function handleSave() {
		const updatedResponses = { ...moduleResponses };

		// Ensure moduleId key exists
		if (!updatedResponses[moduleId]) {
			updatedResponses[moduleId] = {};
		}

		// Update with new answers
		updatedResponses[moduleId] = {
			...updatedResponses[moduleId],
			...answers
		};

		dispatch('save', updatedResponses);
	}
</script>

<div class="module-questions">
	<p class="helper-text">Your answers help personalize exercises to your interests and experiences.</p>

	{#each questions as question (question.id)}
		<div class="question-card">
			<label for={`${moduleId}-${question.id}`} class="question-label">
				{question.question}
			</label>
			<div class="input-wrapper">
				<textarea
					id={`${moduleId}-${question.id}`}
					bind:value={answers[question.id]}
					class="question-input"
					rows="2"
					maxlength="50"
					placeholder="Your answer here..."
				></textarea>
				<div class="char-count {answers[question.id]?.length >= 45 ? 'near-limit' : ''}">
					{answers[question.id]?.length || 0}/50
				</div>
			</div>
		</div>
	{/each}

	<button on:click={handleSave} class="vintage-button">
		<span class="button-text">Save Responses</span>
	</button>
</div>

<style>
	.module-questions {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-family: 'Work Sans', sans-serif;
	}

	.helper-text {
		color: var(--color-warm-gray, #A0998A);
		font-size: 0.875rem;
		line-height: 1.5;
		margin: 0 0 0.5rem 0;
	}

	.question-card {
		background-color: var(--color-cream-paper, #F4F1DE);
		background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(0, 0, 0, 0.01));
		border: 1px solid var(--color-warm-gray, #A0998A);
		border-radius: 6px;
		padding: 0.75rem;
		margin-bottom: 1rem;
	}

	.question-label {
		display: block;
		font-weight: 500;
		color: var(--color-charcoal, #33312E);
		margin-bottom: 0.5rem;
		font-size: 0.9375rem;
	}

	.input-wrapper {
		position: relative;
		background-color: white;
		border: 1px solid var(--color-warm-gray, #A0998A);
		border-radius: 4px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.input-wrapper:focus-within {
		border-color: var(--color-gold, #DDB967);
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
		color: var(--color-charcoal, #33312E);
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
		color: var(--color-warm-gray, #A0998A);
		background-color: rgba(255, 255, 255, 0.8);
		padding: 0.125rem 0.375rem;
		border-radius: 3px;
	}

	.near-limit {
		color: var(--color-terracotta, #C17C74);
		font-weight: 600;
	}

	.vintage-button {
		position: relative;
		align-self: flex-end;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background-color: var(--color-terracotta, #C17C74);
		color: white;
		border: none;
		border-radius: 24px;
		padding: 0.625rem 1.25rem;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		box-shadow: 0 3px 0 var(--color-terracotta-hover, #AD6C66);
		transform: translateY(0);
	}

	.vintage-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 0 var(--color-terracotta-hover, #AD6C66);
		background-color: #b06b64;
	}

	.vintage-button:active {
		transform: translateY(3px);
		box-shadow: 0 0 0 var(--color-terracotta-hover, #AD6C66);
	}

	.button-text {
		position: relative;
		z-index: 1;
	}
</style>
