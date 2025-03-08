<!-- DisplayOnlyQuestion.svelte -->
<script>
    export let question = {};
    export let completed = false;
    export let onComplete = () => {};
</script>

<div class="question-container">
    <div class="question-text">
        <p>{question.question_text}</p>
    </div>
    
    <div class="completion-container">
        <label class="completion-label">
            <input 
                type="checkbox"
                checked={completed}
                on:change={(e) => onComplete(question.id, e.target.checked)}
            />
            <span>Mark as completed</span>
        </label>
    </div>
</div>

<style>
    .question-container {
        margin-bottom: 1.5rem;
    }
    
    .question-text {
        margin-bottom: 0.75rem;
    }
    
    .completion-container {
        display: flex;
        justify-content: flex-end;
        margin-top: 0.5rem;
    }
    
    .completion-label {
        display: flex;
        align-items: center;
        font-size: 0.875rem;
        color: var(--color-charcoal);
        cursor: pointer;
    }
    
    .completion-label span {
        margin-left: 0.5rem;
    }
</style>