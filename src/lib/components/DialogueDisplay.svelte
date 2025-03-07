<!-- DialogueDisplay.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import { fontPreferences } from '$lib/stores/fontPreferences';

	export let dialogue = {};
	export let expanded = false;

	function toggleExpanded() {
		expanded = !expanded;
	}
</script>

<div class="overflow-hidden rounded-lg border border-gray-200 bg-white">
	<div class="p-4">
		<!-- Dialogue number and toggle button -->
		<div class="mb-2 flex items-center justify-between">
			<h4 class="text-md font-medium text-gray-900">Dialogue {dialogue.number}</h4>
			{#if dialogue.notes}
				<button class="text-sm text-blue-600 hover:text-blue-800" on:click={toggleExpanded}>
					{expanded ? 'Hide Notes' : 'View Notes'}
				</button>
			{/if}
		</div>

		<!-- Chinese text -->
		<div class="mb-3">
			{#if $fontPreferences.showSimplified}
				<p class="text-lg leading-relaxed whitespace-pre-line">{dialogue.chinese_simplified}</p>
			{:else}
				<p class="text-lg leading-relaxed whitespace-pre-line">{dialogue.chinese_traditional}</p>
			{/if}
		</div>

		<!-- Pinyin -->
		{#if $fontPreferences.showPinyin}
			<div class="mb-3">
				<p class="whitespace-pre-line text-gray-600">{dialogue.pinyin}</p>
			</div>
		{/if}

		<!-- English translation -->
		<div class="mb-3">
			<p class="whitespace-pre-line text-gray-700">{dialogue.english}</p>
		</div>

		<!-- Notes (expandable) -->
		{#if dialogue.notes && expanded}
			<div transition:slide class="mt-4 rounded-md bg-gray-50 p-4">
				<h5 class="mb-2 font-medium text-gray-900">Notes</h5>
				<p class="whitespace-pre-line text-gray-700">{dialogue.notes}</p>
			</div>
		{/if}
	</div>
</div>
