<!-- src/lib/components/rwp/ExerciseGenerator.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let generating = false;
	export let exerciseType = 'reading_comprehension';
	export let specificFocus = '';
	export let hasExistingContent = false;
	export let debug = false;

	function handleGenerate() {
		dispatch('generate');
	}
</script>

<div class="panel">
	<h2 class="panel-title">Generate Exercise</h2>
	<p class="panel-description">Choose what type of exercise you'd like to practice with.</p>

	<div class="form-group">
		<label for="exercise-type" class="form-label">Exercise Type</label>
		<select id="exercise-type" bind:value={exerciseType} class="form-select">
			<option value="reading_comprehension">Reading Comprehension</option>
			<!-- Add more options as you implement them -->
		</select>
	</div>

	<div class="form-group">
		<label for="specific-focus" class="form-label"> Specific Focus (Optional) </label>
		<input
			id="specific-focus"
			type="text"
			bind:value={specificFocus}
			placeholder="e.g., measure words, time expressions"
			class="form-input"
		/>
	</div>

	<div class="form-group">
		<label class="flex items-center gap-2">
			<input type="checkbox" bind:checked={debug} class="form-checkbox" />
			<span class="text-sm">Debug Mode</span>
		</label>
	</div>

	<button on:click={handleGenerate} disabled={generating} class="generate-button">
		{generating
			? 'Generating...'
			: hasExistingContent
				? 'Regenerate Exercise'
				: 'Generate Exercise'}
	</button>
</div>

<style>
	.panel {
		background-color: white;
		border: 1px solid #e8e5d7;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.panel-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
		margin-bottom: 0.5rem;
	}

	.panel-description {
		color: #6b6a65;
		margin-bottom: 1.25rem;
		font-size: 0.875rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-label {
		display: block;
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
		margin-bottom: 0.375rem;
	}

	.form-select,
	.form-input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #e8e5d7;
		border-radius: 0.375rem;
		font-size: 0.875rem;
		color: #33312e;
	}

	.form-select:focus,
	.form-input:focus {
		outline: none;
		border-color: #34667f;
		box-shadow: 0 0 0 3px rgba(52, 102, 127, 0.1);
	}

	.generate-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		border-radius: 16px;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		background-color: #34667f;
		color: #f4f1de;
		border: 1px solid #295267;
		width: 100%;
	}

	.generate-button:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(41, 82, 103, 0.3);
		background-color: #2d586e;
	}

	.generate-button:disabled {
		background-color: #a0998a;
		border-color: #a0998a;
		cursor: not-allowed;
	}
</style>
