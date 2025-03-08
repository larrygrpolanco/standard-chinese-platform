<!-- MultipleChoiceQuestion.svelte -->
<script>
    export let question = {};
    export let value = "";
    export let onChange = () => {};
    
    // Parse options from string if available
    $: options = question.options ? question.options.split('|') : [];
</script>

<div class="question-container">
    <div class="question-text">
        <p>{question.question_text}</p>
    </div>
    
    <div class="options-container">
        {#each options as option, i}
            <label class="option-label">
                <input 
                    type="radio" 
                    name={`question-${question.id}`}
                    value={option}
                    checked={value === option}
                    on:change={() => onChange(question.id, option)}
                />
                <span class="option-text">{option}</span>
            </label>
        {/each}
    </div>
</div>

<style>
    /* Simple styling to match the vintage aesthetic */
    .question-container {
        margin-bottom: 1.5rem;
    }
    
    .question-text {
        margin-bottom: 0.75rem;
    }
    
    .options-container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .option-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 0.25rem;
        transition: background-color 0.15s ease;
    }
    
    .option-label:hover {
        background-color: rgba(221, 185, 103, 0.1);
    }
    
    .option-text {
        margin-left: 0.5rem;
    }
</style>