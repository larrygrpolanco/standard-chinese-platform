
<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	// Sample stats for the "That's a lot of Chinese!" section
	const stats = [
		{ label: 'Hours of Audio', value: '24+' },
		{ label: 'Vocabulary Words', value: '1,500+' },
		{ label: 'Dialogues', value: '120+' },
		{ label: 'Exercises', value: '200+' }
	];
</script>

<svelte:head>
	<title>Taped Chinese | Learn Mandarin with FSI Course Materials</title>
	<meta
		name="description"
		content="Learn Mandarin Chinese with digitized FSI course materials, including authentic audio recordings originally developed for U.S. diplomats."
	/>
</svelte:head>

<!-- Main container with paper texture background -->
<div
	class="min-h-screen bg-[#F4F1DE]"
	style="background-image: url('/textures/subtle-paper.png'); background-repeat: repeat; background-blend-mode: overlay;"
>
	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-12">
		<div class="mb-8 flex flex-col items-center lg:flex-row lg:justify-between">
			<!-- Left side with text -->
			<div class="lg:w-1/2" in:fade={{ duration: 400, delay: 200 }}>
				<!-- Headline with retro underline -->
				<div class="relative mb-6 inline-block">
					<h1 class="font-['Arvo',serif] text-3xl font-bold text-[#33312E] md:text-4xl lg:text-5xl">
						Learn Chinese<br />Like It's 1985
					</h1>
					<div class="absolute -bottom-2 left-0 h-1.5 w-3/4 bg-[#DDB967]"></div>
				</div>

				<p
					class="mb-6 max-w-xl font-['Work_Sans',sans-serif] text-lg leading-relaxed text-[#33312E] opacity-90"
				>
					Discover the legendary FSI Chinese course that trained generations of diplomats, now
					digitized with all the original audio. A time-tested approach to mastering Mandarin.
				</p>

				<!-- Module CTA Button - Primary -->
				<div class="mb-8 flex flex-wrap gap-4">
					<a
						href="/modules"
						class="group relative inline-flex items-center overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] px-6 py-3 text-lg font-bold text-[#33312E] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B] active:translate-y-0 active:shadow-none"
						style="box-shadow: 2px 2px 0 #826D5B;"
					>
						<span class="mr-2">
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								class="transition-transform group-hover:rotate-12"
							>
								<rect
									x="2"
									y="4"
									width="20"
									height="16"
									rx="2"
									stroke="#33312E"
									stroke-width="2"
								/>
								<circle cx="7" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
								<circle cx="17" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
								<line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#33312E" stroke-width="1.5" />
							</svg>
						</span>
						Start Learning
						<svg
							class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</a>

					<!-- Guidebook Link - Secondary -->
					<a
						href="/guidebook"
						class="inline-flex items-center rounded-lg border border-[#33312E] bg-transparent px-4 py-3 text-base font-medium text-[#33312E] transition-all hover:bg-[#F8EBE8] hover:text-[#C17C74]"
					>
						<svg
							class="mr-2 h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
						Language Learning Guidebook
					</a>
				</div>
			</div>

			<!-- Right side with cassette tape illustration -->
			<div
				class="relative mx-auto w-full max-w-md lg:w-2/5"
				in:fade={{ duration: 400, delay: 400 }}
			>
				<div
					class="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] shadow-[4px_4px_0_#826D5B]"
					style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 4px 4px 0 #826D5B;"
				>
					<!-- Tape spools -->
					<div class="absolute left-1/4 top-1/2 h-16 w-16 -translate-y-1/2 transform">
						<div
							class="h-full w-full rounded-full border-2 border-[#33312E] bg-[#F4F1DE]"
							style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);"
						>
							<div
								class="relative top-1/2 left-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-[#33312E]"
							>
								<!-- Small tape hole -->
							</div>
						</div>
					</div>
					<div class="absolute right-1/4 top-1/2 h-16 w-16 -translate-y-1/2 transform">
						<div
							class="h-full w-full rounded-full border-2 border-[#33312E] bg-[#F4F1DE]"
							style="box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);"
						>
							<div
								class="relative top-1/2 left-1/2 h-1/3 w-1/3 -translate-x-1/2 -translate-y-1/2 transform rounded-full border border-[#33312E]"
							>
								<!-- Small tape hole -->
							</div>
						</div>
					</div>

					<!-- Tape between spools -->
					<div class="absolute top-1/2 h-1 w-1/2 -translate-y-1/2 bg-[#33312E]"></div>

					<!-- Label -->
					<div
						class="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 transform rounded border border-[#33312E] bg-white px-4 py-2 text-center"
					>
						<div class="font-['Courier_New',monospace] font-bold text-[#33312E]">
							FSI CHINESE
						</div>
						<div class="font-['Courier_New',monospace] text-xs text-[#33312E]">
							SIDE A · STANDARD CHINESE
						</div>
					</div>

					<!-- Title in Chinese -->
					<div
						class="absolute bottom-6 left-1/2 w-full -translate-x-1/2 transform text-center font-['Noto_Sans_SC',sans-serif] text-2xl font-bold text-[#C17C74]"
					>
						普通话
					</div>
				</div>

				<!-- Decorative elements -->
				<div
					class="absolute -right-4 -top-4 h-12 w-12 rotate-12 rounded-full bg-[#DDB967] opacity-30"
				></div>
				<div
					class="absolute -bottom-2 -left-4 h-8 w-8 rotate-12 rounded-full bg-[#7D8C5C] opacity-30"
				></div>
			</div>
		</div>
	</section>

	<!-- RWP Section -->
	<section class="container mx-auto px-4 py-12">
		<div
			class="relative overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] p-6 shadow-[4px_4px_0_#826D5B]"
			style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 4px 4px 0 #826D5B;"
		>
			<!-- Decorative cassette corner marks -->
			<div class="absolute left-2 top-2 h-4 w-4 rounded-full border border-[#33312E] opacity-30"></div>
			<div class="absolute right-2 top-2 h-4 w-4 rounded-full border border-[#33312E] opacity-30"></div>
			<div class="absolute bottom-2 left-2 h-4 w-4 rounded-full border border-[#33312E] opacity-30"></div>
			<div
				class="absolute bottom-2 right-2 h-4 w-4 rounded-full border border-[#33312E] opacity-30"
			></div>

			<!-- RWP content -->
			<div class="flex flex-col md:flex-row">
				<!-- Left side with title and description -->
				<div class="md:w-3/5 md:pr-8">
					<div class="relative mb-4 inline-block">
						<h2 class="font-['Arvo',serif] text-2xl font-bold text-[#33312E]">
							Relevant World Practice
						</h2>
						<div class="absolute -bottom-2 left-0 h-1 w-2/3 bg-[#34667F]"></div>
					</div>

					<p class="mb-4 font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
						Relevant World Practice (RWP) brings language learning into your everyday life. Instead of
						generic textbook examples, we create practice materials based on what matters to you - your
						job, hobbies, travel plans, or whatever you're passionate about.
					</p>

					<p class="mb-6 font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
						Tell us your context, and we'll build personalized quizzes, reading passages, and
						listening exercises that help you learn the language you'll actually use. Because the best
						way to learn is through examples that feel relevant to your world.
					</p>

					<a
						href="/rwp"
						class="group inline-flex items-center rounded-lg border border-[#34667F] bg-[#EAF0F3] px-4 py-2 font-medium text-[#34667F] transition-all hover:bg-[#34667F] hover:text-white"
					>
						<span>Try Personalized Practice</span>
						<svg
							class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</a>
				</div>

				<!-- Right side with decorative elements -->
				<div class="mt-6 flex justify-center md:mt-0 md:w-2/5">
					<div
						class="relative flex h-40 w-40 flex-col items-center justify-center rounded-lg border border-[#33312E] bg-[#F4F1DE] p-3 md:h-48 md:w-48"
						style="transform: rotate(3deg); box-shadow: 2px 2px 0 #826D5B;"
					>
						<!-- Decorative tape-reel holes -->
						<div class="mb-2 flex w-full justify-between">
							<div class="h-4 w-4 rounded-full border border-[#33312E] bg-[#EAF0F3]"></div>
							<div class="h-4 w-4 rounded-full border border-[#33312E] bg-[#EAF0F3]"></div>
						</div>

						<!-- Personalized context illustration -->
						<div class="flex flex-col items-center space-y-2">
							<div class="text-center font-['Courier_New',monospace] text-xs text-[#33312E]">
								YOUR CONTEXT
							</div>
							<div
								class="flex w-full items-center justify-center rounded border border-dashed border-[#33312E] bg-white p-1.5"
							>
								<div class="font-['Work_Sans',sans-serif] text-center text-sm text-[#33312E]">
									Work
								</div>
							</div>
							<div
								class="flex w-full items-center justify-center rounded border border-dashed border-[#33312E] bg-white p-1.5"
							>
								<div class="font-['Work_Sans',sans-serif] text-center text-sm text-[#33312E]">
									Travel
								</div>
							</div>
							<div
								class="flex w-full items-center justify-center rounded border border-dashed border-[#33312E] bg-white p-1.5"
							>
								<div class="font-['Work_Sans',sans-serif] text-center text-sm text-[#33312E]">
									Hobbies
								</div>
							</div>
						</div>

						<!-- Tape arrow connecting to RWP -->
						<svg
							class="absolute -left-10 top-1/2 hidden h-10 w-10 -translate-y-1/2 transform text-[#33312E] md:block"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1.5"
								d="M17 8l4 4m0 0l-4 4m4-4H3"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section - "That's a lot of Chinese!" -->
	<section
		class="container mx-auto px-4 py-12"
		style="background-image: url('/textures/subtle-paper.png'); background-repeat: repeat; background-blend-mode: overlay;"
	>
		<div class="mb-10 text-center">
			<h2
				class="relative mx-auto inline-block font-['Arvo',serif] text-2xl font-bold text-[#33312E] md:text-3xl"
			>
				That's a lot of Chinese!
				<div class="absolute -bottom-2 left-0 h-1 w-full bg-[#C17C74]"></div>
			</h2>
		</div>

		<div
			class="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4"
			in:fade={{ duration: 400, delay: 200 }}
		>
			{#each stats as stat}
				<div
					class="flex flex-col items-center rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] p-4 shadow-[2px_2px_0_#826D5B] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B]"
				>
					<span
						class="mb-1 font-['Arvo',serif] text-2xl font-bold text-[#C17C74] md:text-3xl"
						style="text-shadow: 1px 1px 0 #826D5B">{stat.value}</span
					>
					<span class="text-center text-xs font-medium text-[#33312E] md:text-sm">{stat.label}</span>
				</div>
			{/each}
		</div>

		<div
			class="mt-12 flex flex-col justify-center gap-6 md:flex-row"
			in:fade={{ duration: 400, delay: 400 }}
		>
			<div
				class="rounded-lg border-2 border-[#33312E] bg-[#F8EBE8] p-4 text-center shadow-[2px_2px_0_#826D5B] md:w-1/3"
			>
				<div class="flex items-center justify-center">
					<svg
						class="mr-2 h-5 w-5 text-[#C17C74]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M5 13l4 4L19 7"
						/>
					</svg>
					<h3 class="font-['Arvo',serif] text-lg font-bold text-[#33312E]">Free Forever</h3>
				</div>
				<p class="mt-2 text-sm text-[#33312E]">
					This digitized FSI course will always be free and accessible to everyone.
				</p>
			</div>

			<div
				class="rounded-lg border-2 border-[#33312E] bg-[#EBEEE7] p-4 text-center shadow-[2px_2px_0_#826D5B] md:w-1/3"
			>
				<div class="flex items-center justify-center">
					<svg
						class="mr-2 h-5 w-5 text-[#7D8C5C]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						/>
					</svg>
					<h3 class="font-['Arvo',serif] text-lg font-bold text-[#33312E]">Authentic Materials</h3>
				</div>
				<p class="mt-2 text-sm text-[#33312E]">
					Created by linguists to train US diplomats - tried, tested, and effective.
				</p>
			</div>

			<div
				class="rounded-lg border-2 border-[#33312E] bg-[#F9F4E8] p-4 text-center shadow-[2px_2px_0_#826D5B] md:w-1/3"
			>
				<div class="flex items-center justify-center">
					<svg
						class="mr-2 h-5 w-5 text-[#DDB967]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
						/>
					</svg>
					<h3 class="font-['Arvo',serif] text-lg font-bold text-[#33312E]">Flexible Learning</h3>
				</div>
				<p class="mt-2 text-sm text-[#33312E]">
					Choose your own path through the material - learn at your own pace and style.
				</p>
			</div>
		</div>
	</section>

	<!-- About Section -->
	<section class="container mx-auto px-4 py-12">
		<div class="mx-auto max-w-3xl">
			<div class="mb-8 text-center">
				<h2
					class="relative mx-auto inline-block font-['Arvo',serif] text-2xl font-bold text-[#33312E] md:text-3xl"
				>
					About This Project
					<div class="absolute -bottom-2 left-0 h-1 w-full bg-[#34667F]"></div>
				</h2>
			</div>

			<div
				class="rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] p-6 shadow-[4px_4px_0_#826D5B]"
				in:fade={{ duration: 400, delay: 200 }}
				style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 4px 4px 0 #826D5B;"
			>
				<p class="mb-4 font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
					Taped Chinese digitizes the Foreign Service Institute's "Standard Chinese: A Modular
					Approach" course materials from the 1980s, which were originally created to train US
					diplomats in Mandarin Chinese.
				</p>

				<p class="mb-4 font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
					While the original cassette tapes may be vintage, the teaching methods remain remarkably
					effective. Our goal is to preserve this valuable resource and make it accessible to modern
					language learners.
				</p>

				<p class="font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
					This platform presents the complete course in a user-friendly format with all the original
					audio recordings digitized from the tapes. Everything is freely available as these
					materials are in the public domain.
				</p>

				<div class="mt-8 flex justify-center">
					<div
						class="inline-flex items-center font-['Courier_New',monospace] text-xs text-[#33312E] opacity-70"
					>
						<svg
							class="mr-2 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
							/>
						</svg>
						AUDIO DIGITIZED FROM ORIGINAL FSI COURSE TAPES
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-[#A0998A] bg-[#F4F1DE] py-8">
		<div class="container mx-auto px-4 text-center">
			<p class="text-sm text-[#33312E] opacity-70">
				These FSI materials are in the public domain. This is not an official government website.
			</p>
		</div>
	</footer>
</div>
