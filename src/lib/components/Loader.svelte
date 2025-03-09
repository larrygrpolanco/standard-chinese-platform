<!-- src/lib/components/Loader.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	// Simplified props
	export let message = 'Loading tape...';

	// Animation state
	let counter = 0;
	let counterInterval;
	let loadingDots = '';

	// Initialize animations
	onMount(() => {
		// Digital counter animation
		counterInterval = setInterval(() => {
			counter = (counter + 1) % 1000;
		}, 100);

		// Animated dots
		const dotsInterval = setInterval(() => {
			loadingDots = loadingDots.length >= 3 ? '' : loadingDots + '.';
		}, 350);

		return () => {
			clearInterval(counterInterval);
			clearInterval(dotsInterval);
		};
	});

	onDestroy(() => {
		if (counterInterval) clearInterval(counterInterval);
	});

	// Format counter display
	$: counterDisplay = counter.toString().padStart(3, '0');

	// Dynamic message with dots
	$: displayMessage = message.replace(/\.+$/, '') + loadingDots;
</script>

<div class="flex min-h-[160px] w-full flex-col items-center justify-center p-4">
	<!-- Cassette tape visualization -->
	<div
		class="relative mb-2 h-14 w-24 rounded-md border-2 border-[#A0998A] bg-[#F4F1DE] shadow-inner"
	>
		<!-- Cassette label -->
		<div
			class="absolute top-[10%] left-1/2 h-[28%] w-[80%] -translate-x-1/2 rounded-sm border border-[#A0998A] bg-white/90"
		></div>

		<!-- Tape path with movement -->
		<div class="absolute top-[60%] right-0 left-0 h-[1px] bg-[#33312E] opacity-20"></div>
		<div class="absolute top-[calc(70%+1px)] right-[25%] left-[25%] h-[2px]">
			<div class="tape-movement h-full w-full"></div>
		</div>

		<!-- Spinning reels -->
		<div class="absolute top-[60%] left-[28%] h-4 w-4 -translate-x-1/2 -translate-y-1/2">
			<div
				class="h-full w-full animate-spin rounded-full border border-[#33312E] opacity-60"
				style="animation-duration: 1.8s;;"
			>
				<div class="m-auto mt-[30%] h-[40%] w-[40%] rounded-full border border-[#33312E]">
					<div class="m-auto mt-[20%] h-[60%] w-[60%] rounded-full bg-[#33312E]"></div>
				</div>
			</div>
		</div>

		<div class="absolute top-[60%] right-[28%] h-4 w-4 translate-x-1/2 -translate-y-1/2">
			<div
				class="h-full w-full animate-spin rounded-full border border-[#33312E] opacity-60"
				style="animation-duration: 1.5s;"
			>
				<div class="m-auto mt-[30%] h-[40%] w-[40%] rounded-full border border-[#33312E]">
					<div class="m-auto mt-[20%] h-[60%] w-[60%] rounded-full bg-[#33312E]"></div>
				</div>
			</div>
		</div>

		<!-- Cassette windows -->
		<div class="absolute right-0 bottom-[10%] left-0 flex justify-between px-[15%]">
			<div class="h-[4px] w-[35%] rounded-[1px] bg-[#33312E] opacity-40"></div>
			<div class="h-[4px] w-[35%] rounded-[1px] bg-[#33312E] opacity-40"></div>
		</div>
	</div>

	<!-- Vintage digital counter display -->
	<div
		class="mb-2 inline-block rounded bg-[#33312E] px-2 py-0.5 font-mono text-xs tracking-wider text-[#DDB967] shadow-inner"
	>
		{counterDisplay}
	</div>

	<!-- Loading message with animated dots -->
	<p class="text-center font-mono text-sm text-[#33312E]">
		{displayMessage}
	</p>
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
</style>
