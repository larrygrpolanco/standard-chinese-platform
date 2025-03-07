<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
</script>

<svelte:head>
	<title>FSI Chinese Learning Platform</title>
	<meta
		name="description"
		content="A modern approach to the comprehensive FSI Standard Chinese course with 59 hours of audio and 55 modules to help you learn Mandarin effectively."
	/>
</svelte:head>

<!-- Main container with centered layout -->
<div class="flex justify-center w-full">
	<main class="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Hero Section -->
		<section class="py-12 md:py-16">
			<div class="align-items mx-auto max-w-3xl text-center">
				<h1 class="font-['Arvo',serif] font-bold text-3xl text-[#34667F] mb-6 md:text-4xl lg:text-5xl">
					Comprehensive Chinese Learning
				</h1>
				<p class="mx-auto max-w-2xl text-lg leading-relaxed text-[#33312E] mb-8">
					A modernized approach to the Foreign Service Institute's extensive Chinese course — now
					accessible with interactive features and authentic materials.
				</p>

				<div class="flex flex-wrap justify-center gap-4">
					<a
						href="/modules"
						class="flex items-center rounded-lg border border-[#C17C74] bg-[#C17C74] px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#b06c64] hover:shadow-[3px_3px_0_#826D5B] active:translate-y-0.5 active:shadow-none"
					>
						<span>Explore Modules</span>
						<svg class="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
								clip-rule="evenodd"
							/>
						</svg>
					</a>
					<a
						href="#how-it-works"
						class="rounded-lg border border-[#34667F] bg-transparent px-6 py-3 font-medium text-[#34667F] transition-colors hover:bg-[#E8E5D7]"
					>
						How It Works
					</a>
				</div>
			</div>
		</section>


		<!-- Stats Section -->
		<section class="py-10 bg-[#F4F1DE] rounded-xl">
			<div class="mx-auto max-w-4xl">
				<h2 class="font-['Arvo',serif] font-bold text-2xl text-[#34667F] mb-8 text-center">
					A Complete Language Resource
				</h2>

				<div class="grid gap-6 md:grid-cols-3">
					<!-- Hours of Audio -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] font-bold text-4xl text-[#C17C74]">59</div>
						<div class="font-medium text-[#7D8C5C] mt-1">Hours of Audio</div>
					</div>

					<!-- Learning Modules -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] font-bold text-4xl text-[#34667F]">55</div>
						<div class="font-medium text-[#7D8C5C] mt-1">Learning Modules</div>
					</div>

					<!-- Pages of Instruction -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] font-bold text-4xl text-[#DDB967]">2,496</div>
						<div class="font-medium text-[#7D8C5C] mt-1">Pages of Material</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Cassette tape divider -->
		<div class="relative flex justify-center my-6">
			<div class="absolute top-1/2 w-full h-px -translate-y-1/2 bg-[#E0DED3]"></div>
			<div
				class="relative flex items-center justify-center w-10 h-10 rounded-full border border-[#E0DED3] bg-[#F4F1DE]"
			>
				<svg
					class="w-5 h-5 text-[#A0998A]"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect
						x="3"
						y="6"
						width="18"
						height="12"
						rx="1"
						stroke="currentColor"
						stroke-width="1.5"
					/>
					<circle cx="8" cy="12" r="2" stroke="currentColor" stroke-width="1.5" />
					<circle cx="16" cy="12" r="2" stroke="currentColor" stroke-width="1.5" />
					<line x1="10" y1="12" x2="14" y2="12" stroke="currentColor" stroke-width="1.5" />
				</svg>
			</div>
		</div>

		<!-- How It Works Section -->
		<section id="how-it-works" class="py-12">
			<div class="mx-auto max-w-4xl">
				<h2 class="font-['Arvo',serif] font-bold text-2xl text-[#34667F] mb-8 text-center">
					How to Use This Platform
				</h2>

				<div class="grid gap-6 md:grid-cols-3">
					<!-- Step 1 -->
					<div class="flex flex-col p-5 bg-white border border-[#E0DED3] rounded-lg">
						<div class="flex items-center mb-4">
							<div
								class="flex items-center justify-center mr-3 w-8 h-8 font-['Arvo',serif] font-bold text-lg text-[#C17C74] bg-[#F8EBE8] rounded-full"
							>
								1
							</div>
							<h3 class="font-['Arvo',serif] font-semibold text-lg text-[#33312E]">
								Browse Modules
							</h3>
						</div>
						<p class="text-sm text-[#33312E]">
							Choose from core modules organized by topic with progressive difficulty levels.
						</p>
					</div>

					<!-- Step 2 -->
					<div class="flex flex-col p-5 bg-white border border-[#E0DED3] rounded-lg">
						<div class="flex items-center mb-4">
							<div
								class="flex items-center justify-center mr-3 w-8 h-8 font-['Arvo',serif] font-bold text-lg text-[#7D8C5C] bg-[#EBEEE7] rounded-full"
							>
								2
							</div>
							<h3 class="font-['Arvo',serif] font-semibold text-lg text-[#33312E]">
								Study Materials
							</h3>
						</div>
						<p class="text-sm text-[#33312E]">
							Access vocabulary, dialogues, and grammar. Listen to authentic recordings with text.
						</p>
					</div>

					<!-- Step 3 -->
					<div class="flex flex-col p-5 bg-white border border-[#E0DED3] rounded-lg">
						<div class="flex items-center mb-4">
							<div
								class="flex items-center justify-center mr-3 w-8 h-8 font-['Arvo',serif] font-bold text-lg text-[#DDB967] bg-[#F9F4E8] rounded-full"
							>
								3
							</div>
							<h3 class="font-['Arvo',serif] font-semibold text-lg text-[#33312E]">
								Practice & Review
							</h3>
						</div>
						<p class="text-sm text-[#33312E]">
							Complete structured exercises. Toggle between simplified and traditional characters.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Get Started CTA Section -->
		<section class="py-10 mb-8">
			<div class="mx-auto max-w-3xl p-6 bg-white border border-[#E0DED3] rounded-xl shadow-sm">
				<div class="text-center">
					<h2 class="font-['Arvo',serif] font-bold text-2xl text-[#34667F] mb-4">
						Start Learning Chinese Today
					</h2>
					<p class="mb-6 text-[#33312E]">
						Access this comprehensive resource that combines the thoroughness of FSI materials with
						modern learning features.
					</p>

					<a
						href="/modules"
						class="inline-block px-6 py-3 font-medium text-white bg-[#C17C74] border border-[#C17C74] rounded-lg transition-all hover:-translate-y-0.5 hover:bg-[#b06c64] hover:shadow-[3px_3px_0_#826D5B] active:translate-y-0.5 active:shadow-none"
					>
						Browse Core Modules
					</a>

					<div class="flex items-center justify-center mt-5">
						<svg
							class="w-4 h-4 mr-2 text-[#DDB967]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<p class="text-xs text-[#33312E]">
							This platform is completely free and will always remain accessible to all learners.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Footer note -->
		<section class="py-6 border-t border-[#E0DED3]">
			<!-- content as before -->
		</section>
	</main>
</div>