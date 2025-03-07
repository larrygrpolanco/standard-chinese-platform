<!-- src/lib/components/Loader.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	// Customizable props
	export let message = 'Loading tape collection...';
	export let size = 'medium'; // small, medium, large
	export let theme = 'vintage'; // vintage, terracotta, navy, gold, green

	// Animation state
	let counter = 0;
	let counterInterval;
	let loadingDots = '';

	// Size mappings
	$: sizeClasses =
		{
			small: {
				cassette: 'w-20 h-12',
				reels: 'w-3.5 h-3.5',
				fontSize: 'text-xs',
				counter: 'text-[10px] px-1.5 py-0.5'
			},
			medium: {
				cassette: 'w-24 h-14',
				reels: 'w-4 h-4',
				fontSize: 'text-sm',
				counter: 'text-xs px-2 py-0.5'
			},
			large: {
				cassette: 'w-32 h-18',
				reels: 'w-5 h-5',
				fontSize: 'text-base',
				counter: 'text-sm px-2.5 py-0.5'
			}
		}[size] || sizeClasses.medium;

	// Theme color mappings
	$: themeColors =
		{
			vintage: {
				bg: 'bg-[#F4F1DE]',
				border: 'border-[#A0998A]',
				counterBg: 'bg-[#F4F1DE]',
				counterText: 'text-[#A0998A]'
			},
			terracotta: {
				bg: 'bg-[#F8EBE8]',
				border: 'border-[#C17C74]',
				counterBg: 'bg-[#C17C74]',
				counterText: 'text-white'
			},
			navy: {
				bg: 'bg-[#EAF0F3]',
				border: 'border-[#34667F]',
				counterBg: 'bg-[#34667F]',
				counterText: 'text-white'
			},
			gold: {
				bg: 'bg-[#F9F4E8]',
				border: 'border-[#DDB967]',
				counterBg: 'bg-[#33312E]',
				counterText: 'text-[#DDB967]'
			},
			green: {
				bg: 'bg-[#EBEEE7]',
				border: 'border-[#7D8C5C]',
				counterBg: 'bg-[#7D8C5C]',
				counterText: 'text-white'
			}
		}[theme] || themeColors.vintage;

	// Initialize counter and loading animation
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
	$: displayMessage = message ? message.replace(/\.+$/, '') + loadingDots : '';
</script>

<div class="py-6 text-center">
	<div class="inline-flex flex-col items-center gap-3">
		<!-- Cassette tape visualization -->
		<div
			class="relative {sizeClasses.cassette} rounded-md border-2 {themeColors.border} {themeColors.bg} shadow-inner"
		>
			<!-- Cassette label with subtle texture -->
			<div
				class="absolute top-[10%] left-1/2 h-[28%] w-[80%] -translate-x-1/2 overflow-hidden rounded-sm border border-[#A0998A] bg-white/90 shadow-inner"
			>
				<div class="bg-noise absolute inset-0 opacity-10"></div>
			</div>

			<!-- Tape path -->
			<div class="absolute top-[60%] right-0 left-0 h-[1px] bg-[#33312E] opacity-20"></div>

			<!-- Animated tape segment -->
			<div class="absolute top-[calc(60%-1px)] right-[25%] left-[25%] h-[2px]">
				<div class="tape-movement h-full w-full"></div>
			</div>

			<!-- Left spinning reel -->
			<div
				class="absolute top-[60%] left-[28%] -translate-x-1/2 -translate-y-1/2 {sizeClasses.reels}"
			>
				<div
					class="flex h-full w-full animate-spin items-center justify-center rounded-full border border-[#33312E] opacity-60"
					style="animation-duration: 1.7s; animation-direction: reverse;"
				>
					<div
						class="flex h-[40%] w-[40%] items-center justify-center rounded-full border border-[#33312E] opacity-70"
					>
						<div class="h-[60%] w-[60%] rounded-full bg-[#33312E] opacity-80"></div>
					</div>
				</div>
			</div>

			<!-- Right spinning reel -->
			<div
				class="absolute top-[60%] right-[28%] translate-x-1/2 -translate-y-1/2 {sizeClasses.reels}"
			>
				<div
					class="flex h-full w-full animate-spin items-center justify-center rounded-full border border-[#33312E] opacity-60"
					style="animation-duration: 1.5s;"
				>
					<div
						class="flex h-[40%] w-[40%] items-center justify-center rounded-full border border-[#33312E] opacity-70"
					>
						<div class="h-[60%] w-[60%] rounded-full bg-[#33312E] opacity-80"></div>
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
			class="{themeColors.counterBg} {themeColors.counterText} {sizeClasses.counter} inline-block rounded p-1 font-['Courier_New',monospace] tracking-wider shadow-inner"
			style="box-shadow: inset 0 1px 2px rgba(0,0,0,0.3);"
		>
			{counterDisplay}
		</div>

		<!-- Loading message with animated dots -->
		<p class="font-['Courier_New',monospace] {sizeClasses.fontSize} text-[#33312E]">
			{displayMessage}
		</p>
	</div>
</div>

<style>
	/* Tape movement animation */
	.tape-movement {
		height: 100%;
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

	/* Subtle noise texture */
	.bg-noise {
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
	}
</style>
