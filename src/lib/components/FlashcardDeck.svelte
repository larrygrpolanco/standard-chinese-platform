<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { elasticOut, backOut } from 'svelte/easing';
	import FontToggle from './UI/FontToggle.svelte';
	import { fontPreferences } from '$lib/stores/fontPreferences';

	// Props
	/** @type {Array<{ chinese_simplified: string, chinese_traditional: string, pinyin: string, english: string }>} */
	export let vocabulary = [];

	// State
	let cards = [];
	let currentIndex = 0;
	let showFront = true; // true = show Chinese, false = show English
	let startWithChinese = true; // Option to flip the starting side
	let animateFromRight = true;
	let isFlipping = false;
	let touchStartX = 0;
	let touchEndX = 0;

	// Direction for animations
	$: inDirection = animateFromRight ? 300 : -300;
	$: outDirection = animateFromRight ? -300 : 300;

	const dispatch = createEventDispatcher();

	// Shuffle array function
	function shuffleArray(array) {
		let shuffled = [...array];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled;
	}

	// Initialize cards on mount and when vocabulary changes
	$: {
		if (vocabulary.length > 0) {
			cards = shuffleArray(vocabulary);
		}
	}

	// Navigation functions
	function nextCard() {
		if (isFlipping) return;
		animateFromRight = true;
		showFront = startWithChinese; // Reset to default side
		currentIndex = (currentIndex + 1) % cards.length;
	}

	function prevCard() {
		if (isFlipping) return;
		animateFromRight = false;
		showFront = startWithChinese; // Reset to default side
		currentIndex = (currentIndex - 1 + cards.length) % cards.length;
	}

	// Toggle between Chinese and English
	function flipCard() {
		if (isFlipping) return;
		isFlipping = true;
		showFront = !showFront;
		setTimeout(() => {
			isFlipping = false;
		}, 600);
	}

	// Toggle starting side
	function toggleStartSide() {
		startWithChinese = !startWithChinese;
		showFront = startWithChinese;
	}

	// Touch event handlers for swipe
	function handleTouchStart(e) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e) {
		touchEndX = e.changedTouches[0].clientX;
		handleSwipe();
	}

	function handleSwipe() {
		if (isFlipping) return;
		const swipeDistance = touchEndX - touchStartX;
		const threshold = 50; // minimum distance to register as swipe

		if (swipeDistance > threshold) {
			// Swipe right
			prevCard();
		} else if (swipeDistance < -threshold) {
			// Swipe left
			nextCard();
		} else {
			// Tap (not a swipe)
			flipCard();
		}
	}

	// Get current card based on preferences
	$: currentCard = cards[currentIndex] || {
		chinese_simplified: '',
		chinese_traditional: '',
		pinyin: '',
		english: ''
	};

	// Determine which Chinese text to show based on font preferences
	$: chineseText =
		$fontPreferences.displayMode === 'traditional'
			? currentCard.chinese_traditional
			: currentCard.chinese_simplified;

	onMount(() => {
		// Set up keyboard navigation
		const handleKeydown = (e) => {
			if (e.key === 'ArrowRight') {
				nextCard();
			} else if (e.key === 'ArrowLeft') {
				prevCard();
			} else if (e.key === ' ' || e.key === 'Enter') {
				flipCard();
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<section class="flashcard-section">
	<!-- Controls -->
	<div class="flashcard-controls mb-4 flex flex-wrap items-center justify-between gap-2">
		<button class="tape-tab" on:click={toggleStartSide}>
			<svg
				class="mr-2 h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
			</svg>
			Start with {startWithChinese ? 'English' : 'Chinese'}
		</button>

		<!-- Moved FontToggle here from VocabularyTab -->
		<FontToggle compact={true} label="" />
	</div>

	<!-- Flashcard Display -->
	{#if cards.length > 0}
		<div class="flashcard-container bg-beige border-warm-gray rounded-lg border">
			<div class="flashcard-grid-container">
				{#key currentIndex}
					<div
						class="flashcard-content"
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
						on:touchstart={handleTouchStart}
						on:touchend={handleTouchEnd}
					>
						<!-- The entire flip card wrapper -->
						<div class="flip-card">
							<div class="flip-card-inner" class:is-flipped={!showFront}>
								<!-- Front side (Chinese) -->
								<div class="flip-card-front" on:click={flipCard}>
									<div class="flashcard">
										<div class="tape-design top-left"></div>
										<div class="tape-design top-right"></div>
										<div class="tape-design bottom-left"></div>
										<div class="tape-design bottom-right"></div>

										<div class="chinese-side">
											<span class="chinese-text" lang="zh">{chineseText}</span>
											{#if $fontPreferences.showPinyin}
												<div class="pinyin">{currentCard.pinyin}</div>
											{/if}
										</div>

										<div class="flip-hint">
											<svg
												viewBox="0 0 24 24"
												width="16"
												height="16"
												stroke="currentColor"
												fill="none"
											>
												<path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
											</svg>
											<span>Tap to flip</span>
										</div>
									</div>
								</div>

								<!-- Back side (English) -->
								<div class="flip-card-back" on:click={flipCard}>
									<div class="flashcard">
										<div class="tape-design top-left"></div>
										<div class="tape-design top-right"></div>
										<div class="tape-design bottom-left"></div>
										<div class="tape-design bottom-right"></div>

										<div class="english-side">
											<span class="english-text">{currentCard.english}</span>
										</div>

										<div class="flip-hint">
											<svg
												viewBox="0 0 24 24"
												width="16"
												height="16"
												stroke="currentColor"
												fill="none"
											>
												<path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
											</svg>
											<span>Tap to flip</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Card counter - outside the flip animation -->
							<div class="card-counter">
								<span class="current">{currentIndex + 1}</span>
								<span class="divider">/</span>
								<span class="total">{cards.length}</span>
							</div>
						</div>
					</div>
				{/key}
			</div>

			<!-- Navigation buttons -->
			<div class="nav-buttons">
				<!-- Previous card button with tape styling -->
				<button class="tape-nav prev-button" on:click={prevCard} aria-label="Previous card">
					<div class="tape-reel"></div>
				</button>

				<!-- Next card button with tape styling -->
				<button class="tape-nav next-button" on:click={nextCard} aria-label="Next card">
					<div class="tape-reel"></div>
				</button>
			</div>
		</div>
	{:else}
		<div class="empty-flashcards">
			<p>No vocabulary available for flashcards.</p>
		</div>
	{/if}
</section>

<style>
	.flashcard-section {
		width: 100%;
		margin-bottom: 2rem;
	}

	/* Flashcard Container Styling */
	.flashcard-container {
		position: relative;
		min-height: 280px;
		overflow: hidden;
	}

	.flashcard-grid-container {
		display: grid;
		margin: 0 auto;
		background-color: var(--color-cream-paper, #f5f2e8);
		/* Vintage paper texture */
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
		height: 100%;
	}

	.flashcard-grid-container > :global(*) {
		grid-area: 1 / 1;
		background-color: transparent;
	}

	.flashcard-content {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 2rem;
	}

	/* FLIP CARD IMPLEMENTATION */
	.flip-card {
		perspective: 1000px; /* Remove this if you don't want the 3D effect */
		width: 100%;
		max-width: 500px;
		height: 280px;
		position: relative;
	}

	.flip-card-inner {
		position: relative;
		width: 100%;
		height: 100%;
		transition: transform 0.6s;
		transform-style: preserve-3d;
	}

	.flip-card-inner.is-flipped {
		transform: rotateY(180deg);
	}

	.flip-card-front,
	.flip-card-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		cursor: pointer;
	}

	.flip-card-back {
		transform: rotateY(180deg);
	}

	/* Flashcard Styling */
	.flashcard {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		background-color: white;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		padding: 1.5rem;
	}

	/* Tape corners design */
	.tape-design {
		position: absolute;
		width: 30px;
		height: 30px;
		background-color: rgba(221, 185, 103, 0.7);
		opacity: 0.9;
		transform: rotate(45deg);
	}

	.top-left {
		top: -10px;
		left: -10px;
	}

	.top-right {
		top: -10px;
		right: -10px;
	}

	.bottom-left {
		bottom: -10px;
		left: -10px;
	}

	.bottom-right {
		bottom: -10px;
		right: -10px;
	}

	.chinese-side {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
		width: 100%;
	}

	.chinese-side .chinese-text {
		font-size: 3rem;
		line-height: 1.2;
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
	}

	.chinese-side .pinyin {
		font-style: italic;
		color: var(--color-warm-gray, #a0998a);
		font-size: 1.25rem;
	}

	.english-side {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		text-align: center;
		width: 100%;
	}

	.english-side .english-text {
		font-size: 1.75rem;
		text-align: center;
		color: var(--color-charcoal, #33312e);
		max-width: 100%;
	}

	.card-counter {
		position: absolute;
		bottom: -22px;
		right: 0;
		font-size: 0.75rem;
		color: var(--color-warm-gray, #a0998a);
		z-index: 5;
		background: rgba(255, 255, 255, 0.8);
		padding: 2px 6px;
		border-radius: 4px;
	}

	.flip-hint {
		position: absolute;
		bottom: 10px;
		left: 10px;
		font-size: 0.75rem;
		color: var(--color-warm-gray, #a0998a);
		display: flex;
		align-items: center;
		gap: 4px;
	}

	/* Tape-themed Navigation Buttons - Fixed version */
	.nav-buttons {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none; /* Allow clicks to pass through to the card */
	}

	.tape-nav {
		position: absolute;
		top: 0;
		height: 100%;
		width: 40px; /* Wider clickable area */
		background: transparent;
		border: none;
		z-index: 10;
		cursor: pointer;
		pointer-events: auto; /* Make buttons clickable */
		margin: 0;
		padding: 0;
		display: flex;
		align-items: center; /* Center vertically */
	}

	.prev-button {
		left: 0;
		justify-content: flex-end; /* Position at right edge of button area */
	}

	.next-button {
		right: 0;
		justify-content: flex-start; /* Position at left edge of button area */
	}

	.tape-reel {
		position: relative;
		height: 150px;
		width: 40px;
		background: linear-gradient(
			to right,
			rgba(221, 185, 103, 0.1),
			rgba(221, 185, 103, 0.3)
		);
		border: 1px solid rgba(160, 153, 138, 0.2);
		box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);
		transition: all 0.2s ease;
	}

	/* Create the "wound tape" effect with pseudo-elements */
	.tape-reel::before {
		content: '';
		position: absolute;
		top: 5px;
		bottom: 5px;
		left: 0;
		right: 0;
		background: repeating-linear-gradient(
			transparent,
			transparent 2px,
			rgba(0, 0, 0, 0.04) 2px,
			rgba(0, 0, 0, 0.04) 4px
		);
		border-radius: inherit;
	}

	/* Different positioning for left and right reels */
	.prev-button .tape-reel {
		border-top-right-radius: 10px;
		border-bottom-right-radius: 10px;
		border-right: none;
	}

	.next-button .tape-reel {
		border-top-left-radius: 10px;
		border-bottom-left-radius: 10px;
		border-left: none;
	}

	/* Hover effect */
	.tape-nav:hover .tape-reel {
		background: linear-gradient(
			to right,
			rgba(221, 185, 103, 0.2),
			rgba(221, 185, 103, 0.5)
		);
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
	}

	/* Active effect */
	.tape-nav:active .tape-reel {
		background: linear-gradient(
			to right,
			rgba(221, 185, 103, 0.3),
			rgba(221, 185, 103, 0.6)
		);
	}

	/* Toggle Button Styling */
	.tape-tab {
		position: relative;
		display: inline-flex;
		align-items: center;
		padding: 8px 12px;
		font-size: 0.875rem;
		font-weight: 600;
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
			0 5px 0 0 var(--color-button-shadow, #997f4c),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 6px 4px rgba(0, 0, 0, 0.15);
		transition: all 0.1s ease;
		z-index: -1;
	}

	.tape-tab:hover {
		background-color: rgba(221, 185, 103, 0.2);
		transform: translateY(-1px);
	}

	.tape-tab:hover::before {
		box-shadow:
			0 6px 0 0 var(--color-button-shadow, #997f4c),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 7px 4px rgba(0, 0, 0, 0.15);
	}

	/* Pressed state */
	.tape-tab:active {
		transform: translateY(5px);
	}

	.tape-tab:active::before {
		box-shadow:
			0 0 0 0 var(--color-button-shadow, #997f4c),
			inset 0 -1px 0 rgba(0, 0, 0, 0.2),
			inset 0 1px 0 rgba(255, 255, 255, 0.7),
			0 1px 2px rgba(0, 0, 0, 0.1);
	}

	.empty-flashcards {
		padding: 40px 24px;
		text-align: center;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px dashed var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		color: var(--color-warm-gray, #a0998a);
		font-style: italic;
	}

	@media (max-width: 640px) {
		.flashcard-controls {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.flip-card {
			height: 220px;
		}

		.chinese-side .chinese-text {
			font-size: 2rem;
		}

		.english-side .english-text {
			font-size: 1.25rem;
		}

		.tape-design {
			width: 20px;
			height: 20px;
		}

		.tape-reel {
			height: 75px;
			width: 45px;
		}
	}
</style>