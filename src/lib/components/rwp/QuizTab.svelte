<!-- src/lib/components/rwp/QuizTab.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import ChineseText from '$lib/components/UI/ChineseText.svelte';
	import { quizAnswers } from '$lib/stores/quizStore.js';

	const dispatch = createEventDispatcher();

	// Props
	export let content = {};
	export let showAnswers = false;

	// Get values from the store
	let selectedAnswers = {};
	let shortAnswers = {};
	let reflectionAnswer = '';

	// Subscribe to the store
	quizAnswers.subscribe((data) => {
		selectedAnswers = data.selectedAnswers;
		shortAnswers = data.shortAnswers;
		reflectionAnswer = data.reflectionAnswer;
	});

	// Toggle answers visibility
	function toggleAnswers() {
		dispatch('toggleAnswers', !showAnswers);
	}

	// Handle multiple choice selection
	function selectAnswer(questionId, optionId) {
		quizAnswers.update((data) => ({
			...data,
			selectedAnswers: {
				...data.selectedAnswers,
				[questionId]: optionId
			}
		}));
	}

	// Handle short answer input
	function updateShortAnswer(id, value) {
		quizAnswers.update((data) => ({
			...data,
			shortAnswers: {
				...data.shortAnswers,
				[id]: value
			}
		}));
	}

	// Update reflection answer
	function updateReflection(e) {
		quizAnswers.update((data) => ({
			...data,
			reflectionAnswer: e.target.value
		}));
	}
</script>

<div class="quiz-tab">
	<!-- Multiple choice questions section -->
	{#if content.questions?.multiple_choice && content.questions.multiple_choice.length > 0}
		<div class="questions-section">
			<div class="exercise-controls">
				<h3 class="section-title">Multiple Choice Questions</h3>
				<div class="controls">
					<button on:click={toggleAnswers} class="answer-toggle {showAnswers ? 'active' : ''}">
						{showAnswers ? 'Hide Answers' : 'Show Answers'}
					</button>
				</div>
			</div>

			<div class="questions-list">
				{#each content.questions.multiple_choice as question, index}
					<div class="question-item">
						<div class="question-text">
							<span class="question-number">{index + 1}</span>
							<div class="question-content">
								<ChineseText
									simplified={question.question || ''}
									traditional={question.question_traditional || ''}
									pinyin={question.question_pinyin || ''}
									english={question.question_english || ''}
								/>
							</div>
						</div>

						<div class="options-grid">
							{#each question.options as option}
								<div
									class="option-item {selectedAnswers[question.id] === option.id
										? 'user-selected'
										: ''} 
                                {showAnswers && option.id === question.answer
										? 'correct-answer'
										: ''} 
                                {showAnswers &&
									selectedAnswers[question.id] === option.id &&
									option.id !== question.answer
										? 'incorrect-answer'
										: ''}"
									on:click={() => selectAnswer(question.id, option.id)}
									role="button"
									tabindex="0"
								>
									<span class="option-letter">{option.id}</span>
									<div class="option-content">
										<ChineseText
											simplified={option.text || ''}
											traditional={option.text_traditional || ''}
											pinyin={option.pinyin || ''}
											english={option.english || ''}
										/>
									</div>
								</div>
							{/each}
						</div>

						{#if showAnswers}
							<div class="answer-explanation">
								<div class="correct-label">Correct Answer: {question.answer}</div>
								<p class="explanation-text">{question.explanation}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Short answer questions section -->
	{#if content.questions?.short_answer && content.questions.short_answer.length > 0}
		<div class="questions-section">
			<div class="exercise-controls">
				<h3 class="section-title">Short Answer Questions</h3>
			</div>

			<div class="questions-list">
				{#each content.questions.short_answer as question, index}
					<div class="question-item">
						<div class="question-text">
							<span class="question-number">{index + 1}</span>
							<div class="question-content">
								<ChineseText
									simplified={question.question || ''}
									traditional={question.question_traditional || ''}
									pinyin={question.question_pinyin || ''}
									english={question.question_english || ''}
								/>
							</div>
						</div>

						<div class="short-answer-input">
							<textarea
								value={shortAnswers[question.id] || ''}
								on:input={(e) => updateShortAnswer(question.id, e.target.value)}
								placeholder="Write your answer in Chinese..."
								rows="3"
								class="vintage-textarea"
							></textarea>
						</div>

						{#if showAnswers}
							<div class="answer-explanation">
								<div class="sample-answer">
									<h4>Sample Answer:</h4>
									<div class="sample-answer-content">
										<ChineseText
											simplified={question.sample_answer || ''}
											traditional={question.sample_answer_traditional || ''}
											pinyin={question.sample_answer_pinyin || ''}
											english={question.sample_answer_english || ''}
										/>
									</div>
								</div>
								<p class="assessment-guide">{question.assessment_guide || ''}</p>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Reflection question section -->
	{#if content.questions?.reflection}
		<div class="questions-section">
			<h3 class="section-title">Reflection</h3>

			<div class="reflection-question">
				<div class="question-content">
					<ChineseText
						simplified={content.questions.reflection.question || ''}
						traditional={content.questions.reflection.question_traditional || ''}
						pinyin={content.questions.reflection.question_pinyin || ''}
						english={content.questions.reflection.question_english || ''}
					/>
				</div>

				<div class="reflection-input">
					<textarea
						value={reflectionAnswer}
						on:input={updateReflection}
						placeholder="Write your thoughts in Chinese..."
						rows="5"
						class="vintage-textarea"
					></textarea>
				</div>

				{#if showAnswers}
					<div class="guidance-note">
						<h4>Guidance:</h4>
						<p>{content.questions.reflection.guidance || ''}</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.exercise-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	/* Questions styling */
	.questions-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.question-item {
		background-color: var(--color-beige, #e8e5d7);
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--color-warm-gray, #a0998a);
	}

	.question-text {
		display: flex;
		margin-bottom: 0.75rem;
	}

	.question-number {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		min-width: 1.5rem;
		height: 1.5rem;
		background-color: var(--color-gold, #ddb967);
		border-radius: 50%;
		color: var(--color-charcoal, #33312e);
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
		flex-shrink: 0;
		margin-right: 0.75rem;
		margin-top: 0.25rem;
		font-size: 0.9rem;
	}

	.question-content {
		flex: 1;
		min-width: 0; /* Allows content to shrink below natural width */
	}

	/* Options grid */
	.options-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 0.5rem;
		margin-left: 2.25rem;
	}

	.option-item {
		display: flex;
		align-items: flex-start;
		padding: 0.625rem;
		border-radius: 6px;
		background-color: #fcf9f0;
		border: 1px solid var(--color-warm-gray, #a0998a);
		transition: all 0.15s ease;
		cursor: pointer;
	}

	.option-item:hover {
		background-color: rgba(221, 185, 103, 0.1);
	}

	/* State styling for options */
	.user-selected {
		background-color: rgba(193, 124, 116, 0.1);
		border-color: var(--color-terracotta, #c17c74);
	}

	.correct-answer {
		background-color: rgba(125, 140, 92, 0.15);
		border-color: var(--color-green, #7d8c5c);
		position: relative;
	}

	.incorrect-answer {
		background-color: rgba(193, 124, 116, 0.15);
		border-color: #d16b60;
		opacity: 0.8;
	}

	.correct-answer::after {
		content: '✓';
		position: absolute;
		top: 0.375rem;
		right: 0.375rem;
		color: var(--color-green, #7d8c5c);
		font-weight: bold;
		font-size: 1rem;
	}

	.option-letter {
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		width: 1.375rem;
		height: 1.375rem;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 50%;
		margin-right: 0.625rem;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
		flex-shrink: 0;
		font-size: 0.875rem;
	}

	.option-content {
		flex: 1;
		min-width: 0; /* Allows content to shrink below natural width */
	}

	/* Answer explanation styling */
	.answer-explanation {
		margin-top: 0.875rem;
		padding: 0.75rem;
		background-color: rgba(221, 185, 103, 0.1);
		border-radius: 6px;
		border-left: 3px solid var(--color-gold, #ddb967);
	}

	.correct-label {
		font-weight: bold;
		margin-bottom: 0.375rem;
		color: var(--color-charcoal, #33312e);
		font-size: 0.9rem;
	}

	.explanation-text {
		font-size: 0.9rem;
		color: var(--color-charcoal, #33312e);
		line-height: 1.4;
	}

	/* Section titles */
	.section-title {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-navy, #34667f);
		margin: 1.25rem 0 0.75rem 0;
		padding-bottom: 0.375rem;
		border-bottom: 2px dotted var(--color-gold, #ddb967);
	}

	/* Short answer and reflection */
	.short-answer-input,
	.reflection-input {
		margin: 0.5rem 0 1rem;
	}

	.vintage-textarea {
		width: 100%;
		border: 1px solid var(--color-warm-gray, #a0998a);
		background-color: #fcf9f0;
		padding: 0.75rem;
		border-radius: 4px;
		font-family: inherit;
		font-size: 0.9rem;
		transition: border-color 0.2s;
		resize: vertical;
	}

	.vintage-textarea:focus {
		outline: none;
		border-color: var(--color-terracotta, #c17c74);
		box-shadow: 0 0 0 2px rgba(193, 124, 116, 0.1);
	}

	.sample-answer {
		margin-top: 1rem;
		padding: 0.75rem;
		background-color: #fcf9f0;
		border-left: 3px solid var(--color-navy, #34667f);
		border-radius: 4px;
	}

	.sample-answer h4 {
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
		color: var(--color-navy, #34667f);
	}

	.assessment-guide,
	.guidance-note {
		font-style: italic;
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.9rem;
		margin-top: 0.5rem;
	}

	.guidance-note h4 {
		font-size: 0.9rem;
		font-weight: 600;
		margin: 0 0 0.5rem;
	}

	.answer-toggle {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1rem;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 24px;
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.answer-toggle:hover {
		background-color: rgba(221, 185, 103, 0.2);
	}

	.answer-toggle.active {
		background-color: var(--color-gold, #ddb967);
		color: var(--color-charcoal, #33312e);
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.options-grid {
			grid-template-columns: 1fr;
			margin-left: 0.5rem;
			gap: 0.375rem;
		}

		.option-item {
			padding: 0.5rem;
		}

		.question-item {
			padding: 0.875rem;
		}

		.section-title {
			font-size: 1.125rem;
			margin-top: 1rem;
		}

		.answer-toggle {
			align-self: flex-end;
		}
	}
</style>
