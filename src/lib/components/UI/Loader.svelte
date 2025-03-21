<!-- src/lib/components/UI/Loader.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	// Props with defaults
	export let message = 'Loading tape...';
	export let tapeBrand = 'Taped Chinese'; // Add customizable tape brand

	// Animation state
	let counter = 0;
	let counterInterval;
	let dotsInterval;
	let loadingDots = '';

	// Initialize animations
	onMount(() => {
		// Digital counter animation
		counterInterval = setInterval(() => {
			counter = (counter + 1) % 1000;
		}, 200);

		// Animated dots
		dotsInterval = setInterval(() => {
			loadingDots = loadingDots.length >= 3 ? '' : loadingDots + '.';
		}, 350);
	});

	onDestroy(() => {
		clearInterval(counterInterval);
		clearInterval(dotsInterval);
	});

	// Format counter display
	$: counterDisplay = counter.toString().padStart(3, '0');

	// Dynamic message with dots
	$: displayMessage = message.replace(/\.+$/, '') + loadingDots;
</script>

<div class="flex min-h-[160px] w-full flex-col items-center justify-center p-4" role="status" aria-live="polite">
	<!-- Cassette tape visualization -->
	<div
		class="relative mb-2 h-16 w-28 rounded-md border-2 border-[#A0998A] bg-gradient-to-b from-[#F4F1DE] to-[#E9E5D2] shadow-md"
	>
		<!-- Cassette label -->
		<div
			class="absolute top-[10%] left-1/2 h-[28%] w-[80%] -translate-x-1/2 rounded-sm border border-[#A0998A] bg-white/90 shadow-inner"
		>
			<!-- Tape brand name -->
			<div class="flex h-full w-full items-center justify-center">
				<span class="text-[8px] font-bold text-[#33312E]/80">{tapeBrand}</span>
			</div>
		</div>

		<!-- Tape type indicator -->
		<div class="absolute top-[8%] right-[8%] h-2 w-2 rounded-full bg-[#C17C74]"></div>
		
		<!-- Side labels -->
		<div class="absolute top-[42%] left-[8%] text-[6px] font-semibold text-[#33312E]/70">A</div>
		<div class="absolute top-[42%] right-[8%] text-[6px] font-semibold text-[#33312E]/70">B</div>

		<!-- Tape path with movement -->
		<div class="absolute top-[60%] right-0 left-0 h-[1px] bg-[#33312E] opacity-20"></div>
		<div class="absolute top-[calc(85%)] right-[30%] left-[30%] h-[2px]">
			<div class="tape-movement h-full w-full"></div>
		</div>

		<!-- Spinning reels with subtle wobble -->
		<div class="absolute top-[72%] left-[30%] h-4 w-4 -translate-x-1/2 -translate-y-1/2 cassette-wobble-left">
			<div
				class="h-full w-full spin-counter-clockwise rounded-full border border-[#33312E] opacity-60"
				style="animation-duration: 2.5s;"
			>
				<div class="m-auto mt-[30%] h-[30%] w-[30%] rounded-full border border-[#33312E]">
					<div class="m-auto mt-[20%] h-[60%] w-[60%] rounded-full bg-[#33312E]"></div>
				</div>
			</div>
		</div>

		<div class="absolute top-[72%] right-[30%] h-4 w-4 translate-x-1/2 -translate-y-1/2 cassette-wobble-right">
			<div
				class="h-full w-full animate-spin rounded-full border border-[#33312E] opacity-60"
				style="animation-duration: 2.5s;"
			>
				<div class="m-auto mt-[30%] h-[30%] w-[30%] rounded-full border border-[#33312E]">
					<div class="m-auto mt-[20%] h-[60%] w-[60%] rounded-full bg-[#33312E]"></div>
				</div>
			</div>
		</div>

		<!-- Cassette windows with subtle reflection -->
		<div class="absolute right-0 bottom-[10%] left-0 flex justify-between px-[15%]">
			<div class="h-[4px] w-[35%] rounded-[1px] bg-[#33312E] opacity-40 cassette-window"></div>
			<div class="h-[4px] w-[35%] rounded-[1px] bg-[#33312E] opacity-40 cassette-window"></div>
		</div>
		
		<!-- Screw holes -->
		<div class="absolute top-[85%] left-[8%] h-[3px] w-[3px] rounded-full bg-[#33312E]/30"></div>
		<div class="absolute top-[85%] right-[8%] h-[3px] w-[3px] rounded-full bg-[#33312E]/30"></div>
	</div>

	<!-- Vintage digital counter display -->
	<div
		class="mb-2 inline-block rounded bg-[#33312E] px-2 py-0.5 font-mono text-xs tracking-wider text-[#DDB967] shadow-inner digital-display"
	>
		{counterDisplay}
	</div>

	<!-- Loading message with animated dots -->
	<p class="text-center font-mono text-sm text-[#33312E]">
		{displayMessage}
	</p>
	
	<!-- Screen reader text -->
	<span class="sr-only">Loading content, please wait</span>
</div>

<style>
	/* Tape movement animation */
	.tape-movement {
		background: repeating-linear-gradient(
			90deg,
			#33312e,
			#33312e 2px,
			transparent 2px,
			transparent 6px
		);
		background-size: 8px 100%;
		animation: tapeMove 1.2s linear infinite;
		opacity: 0.7;
	}

	@keyframes tapeMove {
		from {
			background-position: 0 0;
		}
		to {
			background-position: -8px 0;
		}
	}
	
	/* Counter-clockwise spin animation for the left reel */
	.spin-counter-clockwise {
		animation: spinReverse 1.8s linear infinite;
	}
	
	@keyframes spinReverse {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(-360deg);
		}
	}
	
	/* Subtle wobble animations to make reels look more mechanical */
	.cassette-wobble-left {
		animation: wobbleLeft 6s ease-in-out infinite;
	}
	
	.cassette-wobble-right {
		animation: wobbleRight 7s ease-in-out infinite;
	}
	
	@keyframes wobbleLeft {
		0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
		50% { transform: translate(-50%, -50%) rotate(-2deg); }
	}
	
	@keyframes wobbleRight {
		0%, 100% { transform: translate(50%, -50%) rotate(0deg); }
		50% { transform: translate(50%, -50%) rotate(1deg); }
	}
	
	/* Subtle reflection effect on cassette windows */
	.cassette-window {
		position: relative;
		overflow: hidden;
	}
	
	.cassette-window::after {
		content: "";
		position: absolute;
		top: 0;
		left: -100%;
		width: 50%;
		height: 100%;
		background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
		animation: shine 3s infinite;
	}
	
	@keyframes shine {
		0% { left: -100%; }
		20% { left: 100%; }
		100% { left: 100%; }
	}
	
	/* Digital display with flicker effect */
	.digital-display {
		position: relative;
		overflow: hidden;
	}
	
	.digital-display::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255,255,255,0.1);
		opacity: 0;
		animation: flicker 8s infinite;
	}
	
	@keyframes flicker {
		0%, 95%, 100% { opacity: 0; }
		96%, 99% { opacity: 0.3; }
	}
</style>
