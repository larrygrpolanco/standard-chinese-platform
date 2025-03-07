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

<!-- Wrapper to ensure proper centering -->
<div class="flex w-full justify-center">
	<div class="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
		<!-- Hero Section with Clear Value Proposition -->
		<section class="py-12 md:py-16">
			<div class="mx-auto max-w-3xl text-center">
				<h1
					class="mb-6 font-['Arvo',serif] text-3xl font-bold text-[#34667F] md:text-4xl lg:text-5xl"
				>
					Comprehensive Chinese Learning
				</h1>
				<p class="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-[#33312E]">
					A modernized approach to the Foreign Service Institute's extensive Chinese course — now
					accessible with interactive features and authentic materials.
				</p>

				<div class="flex flex-wrap justify-center gap-4">
					<a
						href="/modules"
						class="rounded-lg border border-[#C17C74] bg-[#C17C74] px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#b06c64] hover:shadow-[3px_3px_0_#826D5B] active:translate-y-0.5 active:shadow-none"
					>
						<span class="flex items-center">
							<span>Explore Modules</span>
							<svg class="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
									clip-rule="evenodd"
								/>
							</svg>
						</span>
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

		<!-- Impressive Stats Section - Simplified -->
		<section class="rounded-xl bg-[#F4F1DE] py-10">
			<div class="mx-auto max-w-4xl">
				<h2 class="mb-8 text-center font-['Arvo',serif] text-2xl font-bold text-[#34667F]">
					A Complete Language Resource
				</h2>

				<div class="grid gap-6 md:grid-cols-3">
					<!-- Hours of Audio -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] text-4xl font-bold text-[#C17C74]">59</div>
						<div class="mt-1 font-medium text-[#7D8C5C]">Hours of Audio</div>
					</div>

					<!-- Learning Modules -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] text-4xl font-bold text-[#34667F]">55</div>
						<div class="mt-1 font-medium text-[#7D8C5C]">Learning Modules</div>
					</div>

					<!-- Pages of Instruction -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] text-4xl font-bold text-[#DDB967]">2,496</div>
						<div class="mt-1 font-medium text-[#7D8C5C]">Pages of Material</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Impressive Stats Section - Simplified -->
		<section class="rounded-xl bg-[#F4F1DE] py-10">
			<div class="mx-auto max-w-4xl">
				<h2 class="mb-8 text-center font-['Arvo',serif] text-2xl font-bold text-[#34667F]">
					A Complete Language Resource
				</h2>

				<div class="grid gap-6 md:grid-cols-3">
					<!-- Hours of Audio -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] text-4xl font-bold text-[#C17C74]">59</div>
						<div class="mt-1 font-medium text-[#7D8C5C]">Hours of Audio</div>
					</div>

					<!-- Learning Modules -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] text-4xl font-bold text-[#34667F]">55</div>
						<div class="mt-1 font-medium text-[#7D8C5C]">Learning Modules</div>
					</div>

					<!-- Pages of Instruction -->
					<div class="flex flex-col items-center">
						<div class="font-['Arvo',serif] text-4xl font-bold text-[#DDB967]">2,496</div>
						<div class="mt-1 font-medium text-[#7D8C5C]">Pages of Material</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Subtle divider with cassette icon -->
		<div class="relative my-6 flex justify-center">
			<div class="absolute top-1/2 h-px w-full -translate-y-1/2 bg-[#E0DED3]"></div>
			<div
				class="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#E0DED3] bg-[#F4F1DE]"
			>
				<svg
					class="h-5 w-5 text-[#A0998A]"
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

		<!-- How It Works Section - Simplified -->
		<section id="how-it-works" class="py-12">
			<div class="mx-auto max-w-4xl">
				<h2 class="mb-8 text-center font-['Arvo',serif] text-2xl font-bold text-[#34667F]">
					How to Use This Platform
				</h2>

				<div class="grid gap-6 md:grid-cols-3">
					<!-- Step 1 -->
					<div class="flex flex-col rounded-lg border border-[#E0DED3] bg-white p-5">
						<div class="mb-4 flex items-center">
							<div
								class="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#F8EBE8] font-['Arvo',serif] text-lg font-bold text-[#C17C74]"
							>
								1
							</div>
							<h3 class="font-['Arvo',serif] text-lg font-semibold text-[#33312E]">
								Browse Modules
							</h3>
						</div>
						<p class="text-sm text-[#33312E]">
							Choose from core modules organized by topic with progressive difficulty levels.
						</p>
					</div>

					<!-- Step 2 -->
					<div class="flex flex-col rounded-lg border border-[#E0DED3] bg-white p-5">
						<div class="mb-4 flex items-center">
							<div
								class="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#EBEEE7] font-['Arvo',serif] text-lg font-bold text-[#7D8C5C]"
							>
								2
							</div>
							<h3 class="font-['Arvo',serif] text-lg font-semibold text-[#33312E]">
								Study Materials
							</h3>
						</div>
						<p class="text-sm text-[#33312E]">
							Access vocabulary, dialogues, and grammar. Listen to authentic recordings with text.
						</p>
					</div>

					<!-- Step 3 -->
					<div class="flex flex-col rounded-lg border border-[#E0DED3] bg-white p-5">
						<div class="mb-4 flex items-center">
							<div
								class="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#F9F4E8] font-['Arvo',serif] text-lg font-bold text-[#DDB967]"
							>
								3
							</div>
							<h3 class="font-['Arvo',serif] text-lg font-semibold text-[#33312E]">
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

		<!-- Get Started CTA Section - Simplified -->
		<section class="mb-8 py-10">
			<div class="mx-auto max-w-3xl rounded-xl border border-[#E0DED3] bg-white p-6 shadow-sm">
				<div class="text-center">
					<h2 class="mb-4 font-['Arvo',serif] text-2xl font-bold text-[#34667F]">
						Start Learning Chinese Today
					</h2>
					<p class="mb-6 text-[#33312E]">
						Access this comprehensive resource that combines the thoroughness of FSI materials with
						modern learning features.
					</p>

					<a
						href="/modules"
						class="inline-block rounded-lg border border-[#C17C74] bg-[#C17C74] px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#b06c64] hover:shadow-[3px_3px_0_#826D5B] active:translate-y-0.5 active:shadow-none"
					>
						Browse Core Modules
					</a>

					<div class="mt-5 flex items-center justify-center">
						<svg
							class="mr-2 h-4 w-4 text-[#DDB967]"
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

		<!-- Footer note - Simplified -->
		<section class="border-t border-[#E0DED3] py-6">
			<!-- content as before -->
		</section>
	</div>
</div>
