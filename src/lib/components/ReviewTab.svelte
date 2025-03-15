<!-- ReviewTab.svelte -->
<script>
	import DialogueDisplay from './DialogueDisplay.svelte';
	import CassetteTapeSelector from './CassetteTapeSelector.svelte';
	import FontToggle from './UI/FontToggle.svelte';
	import { fontPreferences } from '$lib/stores/fontPreferences';

	// Props
	export let dialogues = [];
	export let tapes = []; // All tapes associated with this unit

	// Add current dialogue tracking
	let currentDialogueIndex = 0;
	let currentTape = null;

	// Handle tape change events
	function handleTapeChange(event) {
		currentTape = event.detail;
	}

	// Sort dialogues by order_num to ensure proper sequence
	$: sortedDialogues = [...dialogues].sort((a, b) => a.order_num - b.order_num);

	// Reset index when dialogues change
	$: {
		if (
			sortedDialogues &&
			sortedDialogues.length > 0 &&
			currentDialogueIndex >= sortedDialogues.length
		) {
			currentDialogueIndex = 0;
		}
	}

	// Navigation functions
	function previousDialogue() {
		if (currentDialogueIndex > 0) {
			currentDialogueIndex--;
		}
	}

	function nextDialogue() {
		if (currentDialogueIndex < sortedDialogues.length - 1) {
			currentDialogueIndex++;
		}
	}
</script>

<div class="review-container">
	<!-- Cassette Tape Selector Component -->
	<CassetteTapeSelector
		{tapes}
		tapeType="review"
		initialTapePrefix="C-1"
		on:tapeChange={handleTapeChange}
	/>

	<!-- Dialogues Section with FontToggle -->
	<section class="section-container">
		<div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<h3 class="section-header">Dialogue Reference</h3>

			<!-- FontToggle component -->
			<div class="mt-2 sm:mt-0">
				<FontToggle />
			</div>
		</div>

		<div class="dialogues-container">
			{#if sortedDialogues.length > 0}
				<DialogueDisplay
					dialogue={sortedDialogues[currentDialogueIndex]}
					onPrevious={previousDialogue}
					onNext={nextDialogue}
					isFirst={currentDialogueIndex === 0}
					isLast={currentDialogueIndex === sortedDialogues.length - 1}
					totalCount={sortedDialogues.length}
				/>
			{:else}
				<div class="empty-state py-8 text-center">
					<p class="text-warm-gray italic">No dialogues available for this unit.</p>
				</div>
			{/if}
		</div>
	</section>
</div>
