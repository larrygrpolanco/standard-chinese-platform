<!-- src/lib/components/ModuleQuestions.svelte -->
<script>
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let moduleId;
	export let moduleResponses = {};

	// Define module-specific questions (5 per module)
	const moduleQuestions = {
		1: [
			{
				id: 'language_interest',
				question: 'What aspects of language learning do you find most enjoyable?'
			},
			{
				id: 'chinese_curiosity',
				question: 'What interests you most about the Chinese language or culture?'
			},
			{
				id: 'learning_preferences',
				question: 'How do you prefer to practice new language skills?'
			},
			{ id: 'chinese_situations', question: 'In what situations do you imagine using Chinese?' },
			{
				id: 'language_goals',
				question: 'What would feel like success to you in your Chinese learning journey?'
			}
		],
		2: [
			{
				id: 'introduction_comfort',
				question: 'What topics do you feel most comfortable sharing when meeting someone new?'
			},
			{
				id: 'conversation_interests',
				question: 'What conversation topics do you find most engaging when getting to know someone?'
			},
			{
				id: 'identity_expression',
				question: 'What aspects of yourself do you most enjoy sharing in conversations?'
			},
			{
				id: 'relationship_values',
				question: 'What qualities do you value most in family or friendship relationships?'
			},
			{
				id: 'meeting_scenarios',
				question:
					'What kinds of first-meeting situations would you like to feel prepared for in Chinese?'
			}
		],
		3: [
			{
				id: 'shopping_interests',
				question: 'What kinds of shopping experiences do you enjoy most when visiting new places?'
			},
			{
				id: 'souvenir_preferences',
				question: 'What types of items would interest you as souvenirs or gifts when traveling?'
			},
			{
				id: 'market_atmosphere',
				question:
					'How do you feel about visiting local markets or shopping districts when traveling?'
			},
			{
				id: 'purchase_interests',
				question: 'What items would you be most interested in being able to purchase in Chinese?'
			},
			{
				id: 'transaction_comfort',
				question:
					'What would help you feel more comfortable conducting transactions in another language?'
			}
		],
		4: [
			{
				id: 'navigation_feelings',
				question: 'How do you feel about finding your way around in unfamiliar places?'
			},
			{
				id: 'exploration_style',
				question: 'Do you prefer planned routes or spontaneous exploration when in new places?'
			},
			{
				id: 'location_interests',
				question: 'What types of locations would you most want to be able to find in China?'
			},
			{
				id: 'direction_scenarios',
				question: 'What navigation scenarios would be most useful for you to practice in Chinese?'
			},
			{
				id: 'place_descriptions',
				question: 'What features do you tend to notice or remember about places you visit?'
			}
		],
		5: [
			{
				id: 'transport_feelings',
				question: 'How do you feel about using different forms of transportation when traveling?'
			},
			{
				id: 'journey_preferences',
				question: 'Do you prefer scenic, convenient, or adventurous transportation options?'
			},
			{
				id: 'travel_scenarios',
				question:
					'What transportation situations would you find most useful to prepare for in Chinese?'
			},
			{
				id: 'journey_activities',
				question: 'What do you enjoy doing during long journeys on buses, trains, or planes?'
			},
			{
				id: 'transport_interests',
				question: 'Which modes of transportation in China are you most curious about experiencing?'
			}
		],
		6: [
			{
				id: 'gathering_preferences',
				question: 'What kinds of social gatherings or meetings do you most enjoy?'
			},
			{
				id: 'invitation_responses',
				question: 'How do you feel about responding to invitations or making arrangements?'
			},
			{
				id: 'social_comfort',
				question: 'What helps you feel comfortable in new social situations?'
			},
			{
				id: 'meeting_interests',
				question:
					'What types of meetings or gatherings would you be interested in joining in China?'
			},
			{
				id: 'scheduling_style',
				question: 'Do you prefer spontaneous get-togethers or carefully planned arrangements?'
			}
		],
		7: [
			{
				id: 'cultural_interests',
				question: 'What aspects of daily life in other cultures do you find most interesting?'
			},
			{
				id: 'family_values',
				question: 'What values or traditions feel important to you in family or community life?'
			},
			{
				id: 'social_curiosity',
				question: 'What would you be curious to learn about Chinese family life or social customs?'
			},
			{
				id: 'tradition_appreciation',
				question: 'What kinds of cultural traditions or celebrations do you most appreciate?'
			},
			{
				id: 'community_interests',
				question: 'What aspects of community life would you be interested in experiencing in China?'
			}
		],
		8: [
			{
				id: 'travel_interests',
				question: 'What aspects of traveling tend to bring you the most enjoyment?'
			},
			{
				id: 'site_curiosity',
				question:
					'What types of places or experiences would you be most eager to discover in China?'
			},
			{
				id: 'travel_approach',
				question:
					'Do you prefer tourist highlights or off-the-beaten-path experiences when traveling?'
			},
			{
				id: 'cultural_engagement',
				question: 'How do you like to engage with local culture when visiting new places?'
			},
			{
				id: 'travel_scenarios',
				question:
					'What travel situations would you find most helpful to be prepared for in Chinese?'
			}
		],
		9: [
			{
				id: 'routine_interests',
				question: 'What parts of daily routine in another country would you be most curious about?'
			},
			{
				id: 'living_preferences',
				question: 'What qualities make a place feel comfortable or like home to you?'
			},
			{
				id: 'leisure_interests',
				question: 'What leisure activities would you be interested in pursuing if living in China?'
			},
			{
				id: 'adaptation_interests',
				question: 'What aspects of life in China would you be most interested in experiencing?'
			},
			{
				id: 'cultural_curiosities',
				question: 'What everyday aspects of Chinese life are you most curious about?'
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
	<p class="helper-text">
		Your answers help personalize exercises to your interests and experiences.
	</p>

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
					rows="3"
					maxlength="250"
					placeholder="Your answer here..."
				></textarea>
				<div class="char-count {answers[question.id]?.length >= 225 ? 'near-limit' : ''}">
					{answers[question.id]?.length || 0}/250
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

	.vintage-button:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 0 var(--color-terracotta-hover, #ad6c66);
		background-color: #b06b64;
	}

	.vintage-button:active {
		transform: translateY(3px);
		box-shadow: 0 0 0 var(--color-terracotta-hover, #ad6c66);
	}

	.button-text {
		position: relative;
		z-index: 1;
	}
</style>
