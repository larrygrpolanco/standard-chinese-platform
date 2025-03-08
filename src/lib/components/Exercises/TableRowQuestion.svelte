<!-- TableRowQuestion.svelte -->
<script>
    export let question = {};
    export let value = {};
    export let onChange = () => {};
    
    // Parse columns from options if available
    $: columns = question.options ? question.options.split('|') : [];
</script>

<div class="question-container">
    <div class="question-text">
        <p>{question.question_text}</p>
    </div>
    
    <div class="table-placeholder">
        <p class="placeholder-text">
            Table response component will be implemented here.
            <br>
            Columns: {columns.join(', ')}
        </p>
    </div>
</div>

<style>
    .question-container {
        margin-bottom: 1.5rem;
    }
    
    .question-text {
        margin-bottom: 0.75rem;
    }
    
    .table-placeholder {
        padding: 1rem;
        border: 1px dashed var(--color-warm-gray);
        border-radius: 0.25rem;
        background-color: rgba(245, 242, 235, 0.7);
    }
    
    .placeholder-text {
        text-align: center;
        font-style: italic;
        color: var(--color-warm-gray);
    }
</style>