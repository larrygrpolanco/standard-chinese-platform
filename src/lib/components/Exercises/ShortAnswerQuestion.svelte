<!-- ShortAnswerQuestion.svelte -->
<script>
    export let question = {};
    export let value = "";
    export let onChange = () => {};
</script>

<div class="question-container">
    <div class="question-text">
        <p>{question.question_text}</p>
    </div>
    
    <div class="answer-container">
        <textarea
            class="answer-input"
            placeholder="Enter your answer here..."
            value={value}
            on:input={(e) => onChange(question.id, e.target.value)}
        ></textarea>
    </div>
</div>

<style>
    .question-container {
        margin-bottom: 1.5rem;
    }
    
    .question-text {
        margin-bottom: 0.75rem;
    }
    
    .answer-input {
        width: 100%;
        min-height: 100px;
        padding: 0.75rem;
        border: 1px solid var(--color-warm-gray);
        border-radius: 0.25rem;
        background-color: var(--color-cream-paper);
        font-family: inherit;
        resize: vertical;
    }
    
    .answer-input:focus {
        outline: none;
        border-color: var(--color-gold);
        box-shadow: 0 0 0 2px rgba(221, 185, 103, 0.3);
    }
</style>