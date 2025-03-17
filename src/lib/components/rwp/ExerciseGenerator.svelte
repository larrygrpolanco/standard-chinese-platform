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

<div class="generator-form">
	<div class="form-group">
		<label for="exercise-type" class="form-label">Practice Type</label>
		<div class="select-wrapper">
			<select id="exercise-type" bind:value={exerciseType} class="vintage-select">
				<option value="reading_comprehension">Reading Comprehension</option>
				<!-- Add more options as you implement them -->
			</select>
			<div class="select-icon">
				<svg viewBox="0 0 24 24" width="16" height="16">
					<path fill="none" stroke="currentColor" stroke-width="2" d="M6 9l6 6 6-6" />
				</svg>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label for="specific-focus" class="form-label">
			Specific Focus <span class="optional-text">(optional)</span>
		</label>
		<input
			id="specific-focus"
			type="text"
			bind:value={specificFocus}
			placeholder="e.g., measure words, time expressions"
			class="vintage-input"
		/>
		<p class="input-hint">Specify grammar points or vocabulary you want to practice</p>
	</div>

	<div class="form-group checkbox-group">
		<label class="vintage-checkbox">
			<input type="checkbox" bind:checked={debug} hidden />
			<span class="checkbox-custom"></span>
			<span class="checkbox-label">Debug Mode</span>
		</label>
	</div>
</div>

<style>
	.generator-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		font-family: 'Work Sans', sans-serif;
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.form-label {
		font-weight: 500;
		color: var(--color-charcoal, #33312E);
		font-size: 0.9375rem;
	}

	.optional-text {
		font-weight: normal;
		font-style: italic;
		font-size: 0.8125rem;
		color: var(--color-warm-gray, #A0998A);
	}

	/* Custom select styling */
	.select-wrapper {
		position: relative;
	}

	.vintage-select {
		appearance: none;
		width: 100%;
		padding: 0.625rem 0.875rem;
		padding-right: 2.5rem; /* Space for icon */
		font-size: 0.875rem;
		color: var(--color-charcoal, #33312E);
		background-color: var(--color-cream-paper, #F4F1DE);
		border: 1px solid var(--color-warm-gray, #A0998A);
		border-radius: 6px;
		cursor: pointer;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	.vintage-select:focus {
		outline: none;
		border-color: var(--color-gold, #DDB967);
		box-shadow: 0 0 0 3px rgba(221, 185, 103, 0.2);
	}

	.select-icon {
		position: absolute;
		right: 0.875rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--color-warm-gray, #A0998A);
		pointer-events: none;
	}

	/* Input styling */
	.vintage-input {
		padding: 0.625rem 0.875rem;
		font-size: 0.875rem;
		color: var(--color-charcoal, #33312E);
		background-color: var(--color-cream-paper, #F4F1DE);
		border: 1px solid var(--color-warm-gray, #A0998A);
		border-radius: 6px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
		transition: all 0.2s;
	}

	.vintage-input:focus {
		outline: none;
		border-color: var(--color-gold, #DDB967);
		box-shadow: 0 0 0 3px rgba(221, 185, 103, 0.2);
	}

	.vintage-input::placeholder {
		color: rgba(160, 152, 138, 0.6);
		font-style: italic;
		font-size: 0.8125rem;
	}

	.input-hint {
		font-size: 0.75rem;
		color: var(--color-warm-gray, #A0998A);
		margin: 0.25rem 0 0 0;
	}

	/* Checkbox styling */
	.checkbox-group {
		margin-top: 0.5rem;
	}

	.vintage-checkbox {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
		user-select: none;
	}

	.checkbox-custom {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-color: var(--color-cream-paper, #F4F1DE);
		border: 1px solid var(--color-warm-gray, #A0998A);
		border-radius: 3px;
		position: relative;
		transition: all 0.2s;
	}

	.checkbox-custom::after {
		content: '';
		position: absolute;
		display: none;
		left: 6px;
		top: 2px;
		width: 5px;
		height: 10px;
		border: solid var(--color-charcoal, #33312E);
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	input[type="checkbox"]:checked + .checkbox-custom {
		background-color: var(--color-gold, #DDB967);
		border-color: var(--color-gold, #DDB967);
	}

	input[type="checkbox"]:checked + .checkbox-custom::after {
		display: block;
	}

	.checkbox-label {
		font-size: 0.875rem;
		color: var(--color-warm-gray, #6B6A65);
	}
</style>