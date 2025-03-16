<!-- src/lib/components/rwp/QuestionDisplay.svelte -->
<script>
	import ChineseText from '$lib/components/UI/ChineseText.svelte';

	export let question;
	export let showAnswers = false;

	// Added debug logging
	console.log('QuestionDisplay received question:', question);
</script>

<div class="question-block">
	<div class="question-text">
		<span class="question-number">{question.id}.</span>
		<ChineseText
			simplified={question.question || ''}
			traditional={question.question_traditional || question.question || ''}
			pinyin={question.question_pinyin || ''}
			english={question.question_english || ''}
		/>
	</div>

	<!-- Multiple choice options -->
	{#if question.type === 'multiple_choice' && question.options && question.options.length > 0}
		<div class="options-container">
			{#each question.options as option}
				<div class="option {showAnswers && question.answer === option.id ? 'correct-answer' : ''}">
					<span class="option-letter">{option.id}.</span>
					<ChineseText
						simplified={option.text || ''}
						traditional={option.text_traditional || option.text || ''}
						pinyin={option.pinyin || ''}
						english=""
					/>
				</div>
			{/each}
		</div>

		{#if showAnswers && question.answer}
			<div class="answer-explanation">
				<div class="answer-label">Answer: {question.answer}</div>
				{#if question.explanation}
					<div class="explanation-text">{question.explanation}</div>
				{/if}
			</div>
		{/if}

		<!-- Short answer questions -->
	{:else if question.type === 'short_answer'}
		{#if showAnswers && question.answer}
			<div class="answer-container">
				<div class="answer-label">Answer:</div>
				<ChineseText
					simplified={question.answer || ''}
					traditional={question.answer_traditional || question.answer || ''}
					pinyin={question.answer_pinyin || ''}
					english={question.answer_english || ''}
				/>
			</div>
		{:else}
			<div class="answer-placeholder">
				<textarea class="answer-input" placeholder="Write your answer here"></textarea>
			</div>
		{/if}
	{:else}
		<div class="error-message">Question type not supported or missing options.</div>
	{/if}
</div>

<style>
	.question-block {
		margin-bottom: 1.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 1px dashed #e8e5d7;
	}

	.question-block:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.question-text {
		margin-bottom: 1rem;
	}

	.question-number {
		font-weight: 600;
		color: #34667f;
		display: inline-block;
		margin-right: 0.5rem;
	}

	.options-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-left: 1.5rem;
	}

	.option {
		padding: 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid #e8e5d7;
		background-color: #f9f8f4;
		transition: background-color 0.2s;
	}

	.option:hover {
		background-color: #f4f1de;
	}

	.option-letter {
		font-weight: 600;
		color: #34667f;
		margin-right: 0.5rem;
	}

	.correct-answer {
		background-color: #e6f3e6;
		border-color: #c1e0c1;
	}

	.answer-explanation {
		margin-top: 1rem;
		padding: 0.75rem;
		background-color: #e6f3e6;
		border-radius: 0.375rem;
		border: 1px solid #c1e0c1;
	}

	.answer-label {
		font-weight: 600;
		color: #2d6a4f;
	}

	.explanation-text {
		margin-top: 0.5rem;
		color: #33312e;
	}

	.answer-container {
		margin-top: 1rem;
		padding: 0.75rem;
		background-color: #e6f3e6;
		border-radius: 0.375rem;
		border: 1px solid #c1e0c1;
	}

	.answer-placeholder {
		margin-top: 1rem;
	}

	.answer-input {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e8e5d7;
		border-radius: 0.375rem;
		min-height: 80px;
		resize: vertical;
	}

	.error-message {
		color: #e53935;
		font-size: 0.875rem;
		margin-top: 0.5rem;
	}
</style>
