<!-- src/lib/components/rwp/ComprehensionExercise.svelte -->
<script>
    import ChineseText from '$lib/components/UI/ChineseText.svelte';
    import FontToggle from '$lib/components/UI/FontToggle.svelte';

    // Props
    export let content = {}; // The content JSON
    export let showAnswers = false; // Whether to show answers
    
    // Track user selected answers
    let selectedAnswers = {};
    let shortAnswers = {};
    let reflectionAnswer = '';
    
    // Handle multiple choice selection
    function selectAnswer(questionId, optionId) {
        selectedAnswers = {
            ...selectedAnswers,
            [questionId]: optionId
        };
    }
    
    // Handle short answer input
    function updateShortAnswer(id, value) {
        shortAnswers = {
            ...shortAnswers,
            [id]: value
        };
    }
    
    // Clear inputs when content changes
    $: if (content) {
        selectedAnswers = {};
        shortAnswers = {};
        reflectionAnswer = '';
    }
</script>

<div class="comprehension-exercise">
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

    <!-- Multiple choice questions section -->
    {#if content.questions?.multiple_choice && content.questions.multiple_choice.length > 0}
    <div class="questions-section">
        <h3 class="section-title">Multiple Choice Questions</h3>

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
        <h3 class="section-title">Short Answer Questions</h3>

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
                            bind:value={shortAnswers[question.id]}
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
                    bind:value={reflectionAnswer}
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
    /* Add styling for the new question types */
    .short-answer-input,
    .reflection-input {
        margin: 0.5rem 0 1rem;
    }

    .vintage-textarea {
        width: 100%;
        border: 1px solid var(--color-border);
        background-color: var(--color-bg-alt);
        padding: 0.75rem;
        border-radius: 4px;
        font-family: inherit;
        font-size: 0.9rem;
        transition: border-color 0.2s;
        resize: vertical;
    }

    .vintage-textarea:focus {
        outline: none;
        border-color: var(--color-accent);
        box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.1);
    }

    .sample-answer {
        margin-top: 1rem;
        padding: 0.75rem;
        background-color: var(--color-bg-lighter);
        border-left: 3px solid var(--color-accent);
        border-radius: 4px;
    }

    .sample-answer h4 {
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
        color: var(--color-text-muted);
    }

    .assessment-guide,
    .guidance-note {
        font-style: italic;
        color: var(--color-text-muted);
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }

    .guidance-note h4 {
        font-size: 0.9rem;
        font-weight: 600;
        margin: 0 0 0.5rem;
    }

    .reflection-question {
        margin-bottom: 2rem;
    }
</style>