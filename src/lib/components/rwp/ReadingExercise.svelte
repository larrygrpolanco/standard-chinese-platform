<!-- src/lib/components/rwp/ReadingExercise.svelte -->
<script>
	import ChineseText from '$lib/components/UI/ChineseText.svelte';
	import FontToggle from '$lib/components/UI/FontToggle.svelte';
	import { onMount } from 'svelte';

	// Props
	export let content = {}; // The reading content JSON
	export let showAnswers = false; // Whether to show answers
	
	// Track user selected answers
	let selectedAnswers = {};
	
	// Handle option selection
	function selectAnswer(questionId, optionId) {
		selectedAnswers = {
			...selectedAnswers,
			[questionId]: optionId
		};
	}
	
	// Clear selections when content changes
	$: if (content) {
		selectedAnswers = {};
	}
</script>

<div class="reading-exercise">
	<!-- Title and introduction -->
	<div class="exercise-header">
		<h2 class="exercise-title">
			<ChineseText
				simplified={content.meta?.title || ''}
				traditional={content.meta?.title_traditional || ''}
				pinyin={content.meta?.title_pinyin || ''}
				english={content.meta?.title_english || ''}
			/>
		</h2>
		{#if content.meta?.introduction}
			<p class="exercise-intro">{content.meta.introduction}</p>
		{/if}
	</div>

	<!-- Font toggle -->
	<div class="font-controls">
		<FontToggle />
	</div>

	<!-- Reading passage section -->
	<div class="reading-section">
		<h3 class="section-title">Reading Passage</h3>
		<div class="reading-content">
			<ChineseText
				simplified={content.story?.text || ''}
				traditional={content.story?.text_traditional || ''}
				pinyin={content.story?.text_pinyin || ''}
				english={content.story?.text_english || ''}
			/>
		</div>
	</div>

	<!-- Comprehension questions section -->
	<div class="questions-section">
		<h3 class="section-title">Comprehension Questions</h3>

		{#if content.questions && content.questions.length > 0}
			<div class="questions-list">
				{#each content.questions as question, index}
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
									class="option-item {selectedAnswers[question.id] === option.id ? 'user-selected' : ''} 
									{showAnswers && option.id === question.answer ? 'correct-answer' : ''} 
									{showAnswers && selectedAnswers[question.id] === option.id && option.id !== question.answer ? 'incorrect-answer' : ''}"
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
											english={option.english ||''}
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
		{:else}
			<p class="no-questions">No questions available</p>
		{/if}
	</div>

	<!-- Vocabulary section -->
	<div class="vocabulary-section">
		<h3 class="section-title">Key Vocabulary</h3>

		{#if content.vocabulary && content.vocabulary.length > 0}
			<div class="vocabulary-grid">
				{#each content.vocabulary as vocab}
					<div class="vocab-item">
						<div class="vocab-term">
							<ChineseText
								simplified={vocab.word || ''}
								traditional={vocab.word_traditional || ''}
								pinyin={vocab.pinyin || ''}
								english={vocab.english || ''}
							/>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<p class="no-vocab">No vocabulary available</p>
		{/if}
	</div>
</div>

<style>
	/* Main container styling with vintage paper effect */
	.reading-exercise {
		font-family: 'Work Sans', sans-serif;
		margin: 0 auto;
		padding: 1.5rem;
		background-color: var(--color-cream-paper, #F4F1DE);
		background-image: 
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
		box-shadow: 
			0 1px 3px rgba(51, 49, 46, 0.1),
			0 4px 6px rgba(0, 0, 0, 0.03);
	}

	/* Header styling */
	.exercise-header {
		margin-bottom: 1.25rem;
		border-bottom: 1px solid var(--color-warm-gray, #A0998A);
		padding-bottom: 0.75rem;
	}

	.exercise-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--color-terracotta, #C17C74);
		margin-bottom: 0.5rem;
	}

	.exercise-intro {
		font-style: italic;
		color: var(--color-warm-gray, #A0998A);
		margin-bottom: 0.5rem;
		line-height: 1.4;
		font-size: 0.95rem;
	}

	/* Font controls styling */
	.font-controls {
		margin-bottom: 1.25rem;
	}

	/* Section titles */
	.section-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-navy, #34667F);
		margin: 1.25rem 0 0.75rem 0;
		padding-bottom: 0.375rem;
		border-bottom: 2px dotted var(--color-gold, #DDB967);
	}

	/* Reading content styling with vintage lined paper effect */
	.reading-content {
		background-color: #fcf9f0;
		background-image: linear-gradient(rgba(220, 220, 220, 0.25) 1px, transparent 1px);
		background-size: 100% 1.6rem;
		padding: 1.25rem;
		border-radius: 8px;
		box-shadow: 
			0 1px 3px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid var(--color-warm-gray, #A0998A);
		border-left: 3px solid var(--color-terracotta, #C17C74);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	/* Questions styling - More compact for mobile */
	.questions-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.question-item {
		background-color: var(--color-beige, #E8E5D7);
		padding: 1rem;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--color-warm-gray, #A0998A);
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
		background-color: var(--color-gold, #DDB967);
		border-radius: 50%;
		color: var(--color-charcoal, #33312E);
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

	/* Options grid - Made more compact */
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
		border: 1px solid var(--color-warm-gray, #A0998A);
		transition: all 0.15s ease;
		cursor: pointer;
	}

	.option-item:hover {
		background-color: rgba(221, 185, 103, 0.1);
	}
	
	/* State styling for options */
	.user-selected {
		background-color: rgba(193, 124, 116, 0.1);
		border-color: var(--color-terracotta, #C17C74);
	}

	.correct-answer {
		background-color: rgba(125, 140, 92, 0.15);
		border-color: var(--color-green, #7D8C5C);
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
		color: var(--color-green, #7D8C5C);
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
		background-color: var(--color-cream-paper, #F4F1DE);
		border: 1px solid var(--color-warm-gray, #A0998A);
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
		border-left: 3px solid var(--color-gold, #DDB967);
	}

	.correct-label {
		font-weight: bold;
		margin-bottom: 0.375rem;
		color: var(--color-charcoal, #33312E);
		font-size: 0.9rem;
	}

	.explanation-text {
		font-size: 0.9rem;
		color: var(--color-charcoal, #33312E);
		line-height: 1.4;
	}

	/* Vocabulary section - More compact layout */
	.vocabulary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.vocab-item {
		background-color: var(--color-cream-paper, #F4F1DE);
		padding: 0.75rem;
		border-radius: 6px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--color-warm-gray, #A0998A);
		transition: transform 0.2s ease;
	}

	.vocab-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
		border-color: var(--color-gold, #DDB967);
	}

	/* Responsive adjustments - More aggressive space saving on mobile */
	@media (max-width: 640px) {
		.reading-exercise {
			padding: 1rem 0.75rem;
		}
		
		.options-grid {
			grid-template-columns: 1fr;
			margin-left: 0.5rem;
			gap: 0.375rem;
		}
		
		.option-item {
			padding: 0.5rem;
		}

		.vocabulary-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		
		.vocab-item {
			padding: 0.625rem;
		}
		
		.reading-content {
			padding: 1rem;
		}
		
		.question-item {
			padding: 0.875rem;
		}
		
		.exercise-title {
			font-size: 1.25rem;
		}
		
		.section-title {
			font-size: 1.125rem;
			margin-top: 1rem;
		}
	}
</style>