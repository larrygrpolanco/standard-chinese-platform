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
				id: 'language_experience',
				question:
					'What previous experience have you had with learning languages, particularly tonal languages?'
			},
			{
				id: 'learning_style',
				question:
					'How would you describe your preferred learning style (visual, auditory, practice-based)?'
			},
			{
				id: 'chinese_motivation',
				question: 'What specifically motivated you to begin learning Chinese?'
			},
			{
				id: 'learning_challenges',
				question: 'What aspects of language learning have you found most challenging in the past?'
			},
			{
				id: 'pronunciation_concerns',
				question: 'Which aspects of Chinese pronunciation are you most concerned about mastering?'
			}
		],
		2: [
			{
				id: 'introduction_context',
				question:
					'In what contexts do you most frequently introduce yourself professionally or socially?'
			},
			{
				id: 'family_structure',
				question:
					'How would you briefly describe your family structure and important relationships?'
			},
			{
				id: 'cultural_identity',
				question:
					'What aspects of your cultural or personal identity feel most important when introducing yourself?'
			},
			{
				id: 'conversation_topics',
				question: 'What topics do you typically discuss when first meeting someone in your culture?'
			},
			{
				id: 'formal_situations',
				question: 'How does your self-introduction change between casual and formal situations?'
			}
		],
		3: [
			{
				id: 'shopping_habits',
				question:
					'What types of shopping do you do most frequently, and how do you approach these transactions?'
			},
			{
				id: 'budget_approach',
				question:
					'How would you describe your approach to budgeting or managing expenses when traveling?'
			},
			{
				id: 'negotiation_comfort',
				question:
					'How comfortable are you with price negotiation, and how might this change in China?'
			},
			{
				id: 'payment_methods',
				question:
					'What payment methods do you typically use, and how might this differ when traveling?'
			},
			{
				id: 'purchase_decisions',
				question: 'What factors most strongly influence your decisions when making purchases?'
			}
		],
		4: [
			{
				id: 'navigation_approach',
				question: 'How do you typically find your way around unfamiliar places?'
			},
			{
				id: 'spatial_descriptions',
				question:
					'How would you describe your ability to explain locations or give directions to others?'
			},
			{
				id: 'location_landmarks',
				question:
					'What types of landmarks do you find most helpful when navigating new environments?'
			},
			{
				id: 'address_systems',
				question: 'How familiar are you with different address systems and location descriptions?'
			},
			{
				id: 'navigation_challenges',
				question: 'What navigation situations have you found most challenging when traveling?'
			}
		],
		5: [
			{
				id: 'transport_preferences',
				question: 'Which forms of transportation do you prefer when traveling, and why?'
			},
			{
				id: 'public_transit_experience',
				question: 'What is your experience using public transportation in foreign countries?'
			},
			{
				id: 'transportation_concerns',
				question: 'What concerns or questions do you have about using transportation in China?'
			},
			{
				id: 'travel_approach',
				question: 'How would you describe your approach to planning transportation on trips?'
			},
			{
				id: 'transit_communication',
				question:
					'What transportation-related interactions have you found most challenging in non-English environments?'
			}
		],
		6: [
			{
				id: 'meeting_contexts',
				question:
					'What types of professional or social meetings do you typically arrange or attend?'
			},
			{
				id: 'scheduling_approach',
				question: 'How do you prefer to schedule and confirm arrangements with others?'
			},
			{
				id: 'invitation_preferences',
				question:
					'How do you typically respond to invitations, and what factors influence your decisions?'
			},
			{
				id: 'social_gathering_style',
				question: 'What kinds of social gatherings do you most enjoy hosting or attending?'
			},
			{
				id: 'professional_etiquette',
				question: 'What meeting etiquette do you consider most important in professional contexts?'
			}
		],
		7: [
			{
				id: 'family_traditions',
				question:
					'What family traditions or values from your culture might be interesting to compare with Chinese traditions?'
			},
			{
				id: 'social_structures',
				question:
					'How would you describe the social structures or hierarchies in your culture or workplace?'
			},
			{
				id: 'cultural_curiosities',
				question:
					'What aspects of Chinese family life or social structures are you most curious about?'
			},
			{
				id: 'generational_perspectives',
				question:
					'How have social norms or family structures changed across generations in your experience?'
			},
			{
				id: 'community_involvement',
				question: 'What role do you play in your community, and how does community shape your life?'
			}
		],
		8: [
			{
				id: 'travel_planning',
				question: 'How do you typically plan and organize trips to new countries?'
			},
			{
				id: 'site_interests',
				question: 'Which historical or cultural sites in China are you most interested in visiting?'
			},
			{
				id: 'travel_concerns',
				question: 'What aspects of traveling in China are you most concerned or curious about?'
			},
			{
				id: 'cultural_experiences',
				question: 'What kinds of authentic cultural experiences do you seek when traveling?'
			},
			{
				id: 'accommodation_preferences',
				question:
					'What factors are most important to you when choosing accommodations while traveling?'
			}
		],
		9: [
			{
				id: 'daily_routine',
				question:
					'What does your typical daily routine look like, and how might it adapt in a different country?'
			},
			{
				id: 'urban_preferences',
				question: 'What aspects of urban living do you most enjoy or find challenging?'
			},
			{
				id: 'leisure_activities',
				question:
					'How do you typically spend your leisure time, and what activities bring you the most enjoyment?'
			},
			{
				id: 'living_arrangements',
				question: 'How would you describe your ideal living arrangement or housing situation?'
			},
			{
				id: 'adaptation_approach',
				question:
					'How do you typically adapt to different customs and daily routines when in a new culture?'
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
