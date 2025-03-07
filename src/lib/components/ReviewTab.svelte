<!-- ReviewTab.svelte -->
<script>
	import { onMount } from 'svelte';
	import DialogueDisplay from './DialogueDisplay.svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import { fontPreferences } from '$lib/stores/fontPreferences';

	// Props
	export let dialogues = [];
	export let tapes = []; // All tapes associated with this unit

	// State management
	let selectedTapeId = null;
	let stickyHeader;
	let headerOffset = 0;

	// Get C-1 and other tapes
	$: reviewTapes = tapes.filter((tape) => tape.title.includes('C-') || tape.title.includes('P-'));
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

	// Toggle for pinyin display
	function togglePinyin() {
		fontPreferences.update((p) => ({ ...p, showPinyin: !p.showPinyin }));
	}

	// Handle sticky header
	onMount(() => {
		if (stickyHeader) {
			headerOffset = stickyHeader.offsetHeight;

			const handleScroll = () => {
				if (!stickyHeader) return;
				if (window.scrollY > stickyHeader.offsetTop) {
					stickyHeader.classList.add('sticky');
					document.body.style.paddingTop = `${headerOffset}px`;
				} else {
					stickyHeader.classList.remove('sticky');
					document.body.style.paddingTop = '0px';
				}
			};

			window.addEventListener('scroll', handleScroll);
			return () => {
				window.removeEventListener('scroll', handleScroll);
				document.body.style.paddingTop = '0px';
			};
		}
	});
</script>

<div class="review-container">
	<!-- Sticky Audio Player and Controls Section -->
	<div
		bind:this={stickyHeader}
		class="sticky-header bg-beige border-warm-gray rounded-lg border p-4"
	>
		<div class="mb-4">
			<h3 class="text-charcoal font-arvo mb-4 text-lg font-medium">Listening & Speaking Tapes</h3>

			<!-- Tape Selection Tabs -->
			<div class="tape-tabs mb-4 flex flex-wrap gap-2">
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
						{tape.title}
					</button>
				{/each}
			</div>

			<!-- Current Audio Player -->
			{#if selectedTape && selectedTape.audio_file}
				<div class="audio-player-container">
					<AudioPlayer audioSrc={selectedTape.audio_file} title={selectedTape.title} />
				</div>
			{:else}
				<div class="audio-placeholder">No audio available for this tape</div>
			{/if}
		</div>

		<!-- Display Controls -->
		<div class="font-controls border-warm-gray border-t pt-4">
			<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<h4 class="text-charcoal font-arvo text-base font-medium">Display Settings</h4>

				<div class="flex flex-wrap items-center gap-4">
					<!-- Character mode toggle (vintage slide switch style) -->
					<div class="vintage-switch-container">
						<label class="text-charcoal text-sm">Character Style:</label>
						<div
							class="vintage-switch bg-cream-paper border-warm-gray mt-1 flex rounded-md border p-1 shadow-inner"
						>
							<button
								class={`relative rounded px-3 py-1 text-sm transition-all ${$fontPreferences.displayMode === 'simplified' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
								on:click={() =>
									fontPreferences.update((p) => ({ ...p, displayMode: 'simplified' }))}
							>
								简体字
							</button>
							<button
								class={`relative rounded px-3 py-1 text-sm transition-all ${$fontPreferences.displayMode === 'traditional' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
								on:click={() =>
									fontPreferences.update((p) => ({ ...p, displayMode: 'traditional' }))}
							>
								繁體字
							</button>
							<button
								class={`relative rounded px-3 py-1 text-sm transition-all ${$fontPreferences.displayMode === 'pinyin' ? 'bg-gold text-charcoal shadow-inner' : 'text-warm-gray'}`}
								on:click={() => fontPreferences.update((p) => ({ ...p, displayMode: 'pinyin' }))}
							>
								Pīnyīn
							</button>
						</div>
					</div>

					<!-- Pinyin toggle (only visible when not in pinyin-only mode) -->
					{#if $fontPreferences.displayMode !== 'pinyin'}
						<div class="vintage-toggle-container">
							<label class="text-charcoal text-sm">Show Pinyin:</label>
							<div class="vintage-toggle mt-1">
								<button
									class="vintage-toggle-button {$fontPreferences.showPinyin ? 'active' : ''}"
									on:click={togglePinyin}
									aria-label="Toggle pinyin display"
								>
									<span class="vintage-toggle-slider"></span>
								</button>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Dialogues Section -->
	<div class="dialogues-container mt-6">
		<h3 class="text-charcoal font-arvo mb-4 text-lg font-medium">Dialogue Reference</h3>

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
	</div>
</div>

<style>
	.sticky-header {
		position: relative;
		z-index: 10;
		background-color: var(--color-beige);
		border: 1px solid var(--color-warm-gray);
		transition: box-shadow 0.3s ease;
	}

	.sticky-header.sticky {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		max-width: calc(100% - 48px);
		margin: 0 auto;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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

	.vintage-switch {
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	/* Vintage toggle styling */
	.vintage-toggle {
		display: inline-block;
	}

	.vintage-toggle-button {
		position: relative;
		display: inline-block;
		width: 48px;
		height: 24px;
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 12px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
		transition: background-color 0.2s;
		cursor: pointer;
	}

	.vintage-toggle-button.active {
		background-color: var(--color-avocado);
	}

	.vintage-toggle-slider {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 18px;
		height: 18px;
		background-color: var(--color-beige);
		border: 1px solid var(--color-warm-gray);
		border-radius: 50%;
		transition: transform 0.2s;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.vintage-toggle-button.active .vintage-toggle-slider {
		transform: translateX(24px);
	}

	@media (max-width: 768px) {
		.sticky-header.sticky {
			max-width: calc(100% - 32px);
		}
	}
</style>
