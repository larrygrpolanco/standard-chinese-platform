<!-- src/lib/components/ModuleQuestions.svelte -->
<script>
	import { createEventDispatcher, onMount, afterUpdate } from 'svelte';
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

	// Remove the afterUpdate hook completely

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
	<p class="mb-4 text-sm">Your answers help create personalized exercises</p>

	{#each questions as question (question.id)}
		<div class="question-group">
			<label for={`${moduleId}-${question.id}`} class="question-label">
				{question.question}
			</label>
			<textarea
				id={`${moduleId}-${question.id}`}
				bind:value={answers[question.id]}
				class="question-input"
				rows="2"
				maxlength="50"
				placeholder="Maximum 50 characters"
			></textarea>
			<div class="char-count {answers[question.id]?.length >= 45 ? 'near-limit' : ''}">
				{answers[question.id]?.length || 0}/50
			</div>
		</div>
	{/each}

	<button on:click={handleSave} class="save-button"> Save Responses </button>
</div>

<style>
	.module-questions {
		font-family: 'Work Sans', sans-serif;
	}

	.question-group {
		margin-bottom: 1rem;
		position: relative;
	}

	.question-label {
		display: block;
		margin-bottom: 0.375rem;
		font-weight: 500;
		color: #33312e;
	}

	.question-input {
		width: 100%;
		padding: 0.625rem;
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 0.25rem;
		font-family: inherit;
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

	.save-button {
		padding: 0.75rem 1.25rem;
		background-color: #826d5b;
		color: #f4f1de;
		border: none;
		border-radius: 9999px;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.save-button:hover {
		background-color: #70594a;
	}
</style>
