<!-- src/lib/components/CassetteTapeSelector.svelte -->
<script>
	import AudioPlayer from './AudioPlayer.svelte';
	import { fly } from 'svelte/transition';
	import { elasticOut, backOut } from 'svelte/easing';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	// Props
	export let tapes = []; // All tapes to choose from
	export let tapeType = 'workbook'; // Type of tapes to filter (review, exercise, etc.)
	export let initialTapePrefix = 'C-1'; // Default tape to select (e.g., C-1, P-1)

	// State management
	let selectedTapeId = null;
	let previousTapeId = null;
	let animateFromRight = true;
	let hasMounted = false;

	// Set directions based on toggle
	$: inDirection = animateFromRight ? 300 : -300;
	$: outDirection = animateFromRight ? -300 : 300;

	// Filter tapes by type
	$: filteredTapes =
		tapeType === 'none'
			? tapes // Skip filtering if tapeType is 'none'
			: tapes.filter((tape) => tape.tape_type === tapeType);

	// $: console.log('CassetteTapeSelector filtered tapes:', filteredTapes);

	// Handle tape data changes and update selection when needed
	$: {
		if (hasMounted && filteredTapes.length > 0) {
			// If no tape is selected or the selected tape is no longer in the filtered list
			const currentTapeExists =
				selectedTapeId && filteredTapes.some((tape) => tape.id === selectedTapeId);

			if (!currentTapeExists) {
				// Try to find a tape with the initial prefix
				const defaultTape = filteredTapes.find((tape) => tape.title.includes(initialTapePrefix));
				// Or just use the first available tape
				selectedTapeId = defaultTape ? defaultTape.id : filteredTapes[0].id;
				// console.log('Tape selection updated after data change:', selectedTapeId);
			}
		}
	}

	// Get the currently selected tape from the filtered list
	$: selectedTape = selectedTapeId
		? filteredTapes.find((tape) => tape.id === selectedTapeId)
		: filteredTapes.length > 0
			? filteredTapes[0]
			: null;

	// $: console.log('CassetteTapeSelector selected tape:', selectedTape);

	// Dispatch selected tape to parent
	$: {
		if (selectedTape) {
			dispatch('tapeChange', selectedTape);
		}
	}

	// Initialize when component mounts
	onMount(() => {
		if (filteredTapes.length > 0) {
			// Try to find a tape with the initial prefix
			const defaultTape = filteredTapes.find((tape) => tape.title.includes(initialTapePrefix));
			selectedTapeId = defaultTape ? defaultTape.id : filteredTapes[0].id;
			// console.log('Initial tape selected on mount:', selectedTapeId);
		}
		hasMounted = true;
	});

	// Toggle animation direction whenever tape changes
	$: {
		if (selectedTapeId !== previousTapeId && selectedTapeId !== null) {
			// Only toggle after the first selection
			if (previousTapeId !== null) {
				animateFromRight = !animateFromRight;
			}
			previousTapeId = selectedTapeId;
		}
	}

	// Generate display title for the UI
	function getTapeDisplayTitle(tape) {
		if (!tape) return '';

		// Check if this is a module 7-9 tape (has simple "Tape X" format)
		// Module 7-9 tapes have IDs starting with 7, 8, or 9
		const moduleNumber = Math.floor(parseInt(tape.id.toString()) / 100);
		
		if (moduleNumber >= 7) {
			// Handle modules 7-9 with different format
			if (tape.tape_type === 'review') {
				return `Review ${tape.title}`;
			} else if (tape.tape_type === 'workbook') {
				return `Workbook ${tape.title}`;
			} else {
				return tape.title;
			}
		} else {
			// Original behavior for modules 1-6
			const tapeNumber = tape.title.split('-')[1] || '';

			if (tape.title.includes('C-')) {
				return `Comprehension Tape-${tapeNumber}`;
			} else if (tape.title.includes('P-')) {
				return `Production Tape-${tapeNumber}`;
			} else {
				return tape.title; // Fallback to original title
			}
		}
	}
</script>

<section class="section-container">
	<!-- Tape Selection Tabs -->
	<div class="tape-tabs-container mb-4 flex flex-wrap gap-2">
		{#each filteredTapes as tape}
			<button
				class="tape-tab {selectedTapeId === tape.id ? 'active' : ''}"
				on:click={() => (selectedTapeId = tape.id)}
				aria-pressed={selectedTapeId === tape.id}
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
				{getTapeDisplayTitle(tape)}
			</button>
		{/each}
	</div>

	<!-- Audio Player Container with animation -->
	<div class="audio-player-wrapper bg-beige border-warm-gray rounded-lg border">
		<div class="audio-player-grid-container">
			{#key selectedTapeId}
				<div
					class="audio-player-content p-4"
					in:fly={{
						x: inDirection,
						duration: 600,
						delay: 300,
						easing: elasticOut
					}}
					out:fly={{
						x: outDirection,
						duration: 300,
						easing: backOut
					}}
				>
					{#if selectedTape && selectedTape.audio_file}
						<div>
							<AudioPlayer audioSrc={selectedTape.audio_file} />
						</div>
					{:else}
						<div class="audio-placeholder">
							{selectedTape ? 'No audio available for this tape' : 'No tape selected'}
						</div>
					{/if}
				</div>
			{/key}
		</div>
	</div>
</section>

<style>
	.audio-player-wrapper {
		position: relative;
		min-height: 180px;
		overflow: hidden;
        
	}

	.audio-player-grid-container {
		display: grid;
		margin: 0 auto;
background-color: var(--color-cream-paper, #f5f2e8);
    /* Vintage paper texture */
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
      linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
	}

	/* This critical CSS ensures transitioning elements occupy same space */
	.audio-player-grid-container > :global(*) {
		grid-area: 1 / 1;
        background-color: transparent;
    
	}

	.audio-player-content {
		width: 100%;
	}

	/* Mechanical styling for tape tabs */
	.tape-tab {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 8px 12px;
		font-size: 0.875rem;
		font-weight: 600;
        width:auto;
		color: var(--color-charcoal);
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 6px;
		transition: all 0.1s ease;
		transform: translateZ(0);
	}

	/* Button shadow and 3D effect */
	.tape-tab::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: transparent;
		border-radius: 6px;
		box-shadow:
			0 5px 0 0 var(--color-button-shadow),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 6px 4px rgba(0, 0, 0, 0.15);
		transition: all 0.1s ease;
		z-index: -1;
	}

	.tape-tab:hover:not(.active) {
		background-color: rgba(221, 185, 103, 0.2);
		transform: translateY(-1px);
	}

	.tape-tab:hover:not(.active)::before {
		box-shadow:
			0 6px 0 0 var(--color-button-shadow),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 7px 4px rgba(0, 0, 0, 0.15);
	}

	/* Pressed state */
	.tape-tab.active {
		background-color: var(--color-gold);
		color: var(--color-charcoal);
		transform: translateY(5px);
	}

	.tape-tab.active::before {
		box-shadow:
			0 0 0 0 var(--color-button-shadow),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.tape-tab:active {
		transform: translateY(5px);
	}

	.tape-tab:active::before {
		box-shadow:
			0 0 0 0 var(--color-button-shadow),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 1px 2px rgba(0, 0, 0, 0.1);
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
