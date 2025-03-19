<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let generating = false;
	export let specificFocus = '';
	export let hasExistingContent = false;
	export let debug = false;

	function handleGenerate() {
		dispatch('generate');
	}
</script>

<div class="generator-form">
	<div class="form-group">
		<label for="specific-focus" class="form-label">
			And... <span class="optional-text">(optional)</span>
		</label>
		<input
			id="specific-focus"
			type="text"
			bind:value={specificFocus}
			placeholder="Add anything you want to practice or include"
			class="vintage-input"
		/>
		<p class="input-hint">Specific grammar, vocabulary, situations, etc.</p>
	</div>

	<div class="form-group checkbox-group">
		<label class="vintage-checkbox">
			<input type="checkbox" bind:checked={debug} hidden />
			<span class="checkbox-custom"></span>
			<span class="checkbox-label">Debug Mode</span>
		</label>
	</div>
</div>
