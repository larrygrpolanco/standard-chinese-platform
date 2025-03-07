<!-- ReviewTab.svelte -->
<script>
	import DialogueDisplay from './DialogueDisplay.svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import FontToggle from './FontToggle.svelte';
	import { fontPreferences } from '$lib/stores/fontPreferences';

	// Props
	export let dialogues = [];
	export let tapes = []; // All tapes associated with this unit

	// State management
	let selectedTapeId = null;

	// Get C-1 and other tapes
	$: reviewTapes = tapes.filter((tape) => tape.tape_type === 'review');
	$: selectedTape =
		tapes.find((tape) => tape.id === selectedTapeId) ||
		(reviewTapes.length > 0 ? reviewTapes[0] : null);

	// Set initial selected tape to first C-1 tape if available
	$: {
		if (!selectedTapeId && reviewTapes.length > 0) {
			const c1Tape = reviewTapes.find((tape) => tape.title.includes('C-1'));
			selectedTapeId = c1Tape ? c1Tape.id : reviewTapes[0].id;
		}
	}

	// Generate better display title for the cassette player
	$: tapeDisplayTitle = selectedTape
		? selectedTape.title.includes('C-')
			? `Comprehension Tape ${selectedTape.title.split('-')[1]}`
			: `Production Tape ${selectedTape.title.split('-')[1]}`
		: '';
</script>

<div class="review-container">
	<!-- Section Title with proper section-header class -->
	<section class="section-container">
		<!-- Tape Selection Tabs moved below the heading -->
		<div class="tape-tabs-container mb-4 flex flex-wrap gap-2">
			{#each reviewTapes as tape}
				<button
					class="tape-tab {selectedTapeId === tape.id ? 'active' : ''}"
					on:click={() => (selectedTapeId = tape.id)}
				>
					<svg
						class="mr-2 h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<circle cx="12" cy="12" r="10" />
						<circle cx="12" cy="12" r="3" />
					</svg>
					{#if tape.title.includes('C-')}
						Comprehension Tape
					{:else if tape.title.includes('P-')}
						Production Tape
					{:else}
						{tape.title} <!-- Fallback to original title if no C- or P- -->
					{/if}
				</button>
			{/each}
		</div>

		<!-- Audio Player Container -->
		<div class="audio-player-wrapper bg-beige border-warm-gray rounded-lg border">
			<div class="audio-player-container p-4">
				{#if selectedTape && selectedTape.audio_file}
					<AudioPlayer audioSrc={selectedTape.audio_file} />
				{:else}
					<div class="audio-placeholder">No audio available for this tape</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Dialogues Section with FontToggle to the right -->
	<section class="section-container">
		<div class="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
			<h3 class="section-header">Dialogue Reference</h3>

			<!-- FontToggle component -->
			<div class="mt-2 sm:mt-0">
				<FontToggle />
			</div>
		</div>

		<div class="dialogues-list space-y-6">
			{#each dialogues as dialogue (dialogue.id)}
				<DialogueDisplay {dialogue} />
			{/each}
		</div>

		{#if dialogues.length === 0}
			<div class="empty-state py-8 text-center">
				<p class="text-warm-gray italic">No dialogues available for this unit.</p>
			</div>
		{/if}
	</section>
</div>

<style>
	.audio-player-wrapper {
		background-color: var(--color-beige);
	}

	.tape-tab {
		display: inline-flex;
		align-items: center;
		padding: 8px 12px;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-charcoal);
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 16px;
		transition: all 0.2s;
	}

	.tape-tab:hover:not(.active) {
		background-color: rgba(221, 185, 103, 0.2);
	}

	.tape-tab.active {
		background-color: var(--color-gold);
		color: var(--color-charcoal);
	}

	.audio-player-container {
		margin: 0 auto;
	}

	.audio-placeholder {
		padding: 16px;
		background-color: var(--color-cream-paper);
		border: 1px dashed var(--color-warm-gray);
		border-radius: 8px;
		color: var(--color-warm-gray);
		text-align: center;
		font-style: italic;
	}
</style>
