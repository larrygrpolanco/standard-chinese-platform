<!-- ExercisesTab.svelte -->
<script>

    
    // Props
    export let exercises = [];
    export let workbookTapes = [];
    
    // Group exercises by type for easier display
    $: comprehensionExercises = exercises.filter((ex) => ex.exercise_type === 'comprehension');
    $: productionExercises = exercises.filter((ex) => ex.exercise_type === 'production');
    
    // Get the tape associated with an exercise
    function getTapeForExercise(exerciseId) {
        const tape = workbookTapes.find(
            (tape) => exercises.find((ex) => ex.id === exerciseId)?.tape_id === tape.id
        );
        return tape || null;
    }
</script>

<!-- Comprehension Exercises Section -->
{#if comprehensionExercises.length > 0}
    <section class="section-container">
        <h3 class="section-header">Comprehension Exercises</h3>
        <div class="exercise-container">
            {#each comprehensionExercises as exercise}
                {@const tape = getTapeForExercise(exercise.id)}
                <ExerciseDisplay {exercise} {tape} />
            {/each}
        </div>
    </section>
{/if}

<!-- Production Exercises Section -->
{#if productionExercises.length > 0}
    <section class="section-container">
        <h3 class="section-header">Production Exercises</h3>
        <div class="exercise-container">
            {#each productionExercises as exercise}
                {@const tape = getTapeForExercise(exercise.id)}
                <ExerciseDisplay {exercise} {tape} />
            {/each}
        </div>
    </section>
{/if}

{#if comprehensionExercises.length === 0 && productionExercises.length === 0}
    <div class="empty-state">
        <p>No exercises available for this unit yet.</p>
    </div>
{/if}

<style>
    .section-container {
        border-bottom: 1px solid var(--color-warm-gray, #a0998a);
        padding-bottom: 32px;
        margin-bottom: 16px;
    }

    .section-container:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }

    .section-header {
        font-family: 'Arvo', serif;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-charcoal, #33312e);
        margin-bottom: 24px;
        position: relative;
        padding-bottom: 8px;
    }

    .section-header::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 60px;
        height: 3px;
        background-color: var(--color-gold, #ddb967);
    }

    .empty-state {
        padding: 48px 24px;
        text-align: center;
        color: var(--color-warm-gray, #a0998a);
        font-style: italic;
    }
</style>