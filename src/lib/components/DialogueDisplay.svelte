<!-- src/lib/components/DialogueDisplay.svelte -->
<script>
	import { slide } from 'svelte/transition';
	import ChineseText from './ChineseText.svelte';

	// Props
	export let dialogue;
	export let expanded = false;

	// Toggle notes visibility
	function toggleNotes() {
		expanded = !expanded;
	}
</script>

<div class="overflow-hidden rounded-lg border border-gray-200">
	<!-- Dialogue header -->
	<div class="border-b border-gray-200 bg-gray-50 px-4 py-3">
		<h4 class="font-medium text-gray-700">Dialogue {dialogue.number}</h4>
	</div>

	<!-- Dialogue content -->
	<div class="p-4">
		<!-- Side-by-side on desktop, stacked on mobile -->
		<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
			<!-- Chinese text -->
			<div>
				<h5 class="mb-2 text-sm font-medium text-gray-500">Chinese</h5>
				<ChineseText
					simplified={dialogue.chinese_simplified}
					traditional={dialogue.chinese_traditional}
					pinyin={dialogue.pinyin}
				/>
			</div>

			<!-- English translation -->
			<div>
				<h5 class="mb-2 text-sm font-medium text-gray-500">English</h5>
				<p class="whitespace-pre-line text-gray-700">{dialogue.english}</p>
			</div>
		</div>

		<!-- Notes section (collapsible) -->
		{#if dialogue.notes}
			<div class="mt-5 border-t border-gray-100 pt-4">
				<button
					class="flex items-center text-sm text-gray-600 hover:text-[#1A5276]"
					on:click={toggleNotes}
				>
					<svg
						class="mr-1 h-4 w-4 transition-transform {expanded ? 'rotate-90' : ''}"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
					{expanded ? 'Hide Notes' : 'Show Notes'}
				</button>

				{#if expanded}
					<div transition:slide={{ duration: 300 }} class="mt-3 rounded-md bg-gray-50 p-4 text-sm">
						<p class="whitespace-pre-line">{dialogue.notes}</p>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
