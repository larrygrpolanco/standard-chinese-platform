<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { getModules } from '$lib/supabase/client';

	let featuredModules = [];
	let loading = true;

	onMount(async () => {
		// Load just the first 3 modules for featured section
		featuredModules = await getModules();
		featuredModules = featuredModules.slice(0, 3);
		loading = false;
	});
</script>

<svelte:head>
	<title>FSI Chinese Learning Platform</title>
</svelte:head>

<!-- Hero Section -->
<section class="py-12 text-center md:py-20">
	<div class="mx-auto max-w-4xl px-4">
		<h1 class="mb-6 font-['Arvo',serif] text-4xl font-bold text-[#34667F] md:text-5xl">
			FSI Chinese Learning
		</h1>

		<p class="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-[#33312E] md:text-xl">
			A modern approach to the Foreign Service Institute's "Standard Chinese" course, designed to
			help you learn Mandarin effectively at your own pace.
		</p>

		<div class="flex flex-wrap justify-center gap-4">
			<a
				href="/modules"
				class="rounded-lg border border-[#C17C74] bg-[#C17C74] px-6 py-3 font-medium text-white transition-colors hover:bg-[#b06c64] active:translate-y-0.5 active:shadow-inner"
			>
				Browse Modules
			</a>
			<a
				href="#about"
				class="rounded-lg border border-[#7D8C5C] bg-transparent px-6 py-3 font-medium text-[#7D8C5C] transition-colors hover:bg-[#E8E5D7] active:translate-y-0.5 active:shadow-inner"
			>
				Learn More
			</a>
		</div>
	</div>
</section>

<!-- Featured Modules Section -->
<section class="py-12">
	<div class="container mx-auto px-4">
		<h2 class="mb-8 text-center font-['Arvo',serif] text-2xl font-bold text-[#34667F] md:text-3xl">
			Featured Modules
		</h2>

		{#if loading}
			<div class="py-8 text-center">
				<p>Loading modules...</p>
			</div>
		{:else}
			<div class="grid gap-6 md:grid-cols-3">
				{#each featuredModules as module}
					<a
						href="/modules/{module.id}"
						class="flex flex-col rounded-lg border border-[#A0998A] bg-[#E8E5D7] p-6 transition-colors hover:border-[#7D8C5C]"
					>
						<!-- Module number styled as vintage circular sticker -->
						<div
							class="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#33312E] bg-[#DDB967] text-[#33312E]"
							style="transform: rotate(-5deg);"
						>
							<span class="font-['Arvo',serif] text-lg font-bold">{module.id}</span>
							<!-- Subtle "worn" edge effect -->
							<div class="absolute inset-0 rounded-full border-4 border-[#DDB967] opacity-20"></div>
						</div>

						<h3 class="mb-2 font-['Arvo',serif] text-xl font-semibold">{module.title}</h3>
						<p class="mb-4 flex-grow text-sm text-[#33312E]">{module.description}</p>
						<span class="text-sm font-medium text-[#C17C74]">Explore module →</span>
					</a>
				{/each}
			</div>

			<div class="mt-8 text-center">
				<a
					href="/modules"
					class="inline-block border-b border-[#34667F] pb-1 font-medium text-[#34667F] transition-colors hover:border-[#C17C74] hover:text-[#C17C74]"
				>
					View all modules →
				</a>
			</div>
		{/if}
	</div>
</section>

<!-- About Section - styled like a paper sheet -->
<section id="about" class="py-12 md:py-16">
	<div class="container mx-auto px-4">
		<div
			class="mx-auto max-w-[680px] rounded-lg border border-[#A0998A] bg-[#E8E5D7] p-8"
			style="background-image: url('/textures/subtle-paper.png'); background-repeat: repeat;"
		>
			<h2
				class="mb-6 text-center font-['Arvo',serif] text-2xl font-bold text-[#34667F] md:text-3xl"
			>
				About This Platform
			</h2>

			<div class="prose prose-lg mx-auto">
				<p class="mb-4">
					This platform digitizes the comprehensive FSI Standard Chinese course originally developed
					to train U.S. diplomats. The course follows a modular approach with 9 core modules that
					build speaking, listening, reading, and writing skills.
				</p>

				<p class="mb-4">
					Each module contains multiple units with dialogues, vocabulary, audio recordings, and
					interactive exercises. You can learn at your own pace, toggle between simplified and
					traditional characters, and practice with authentic audio materials.
				</p>

				<p>
					The platform is designed to be accessible to learners at all levels, from complete
					beginners to those looking to refine their existing Chinese language skills.
				</p>
			</div>
		</div>
	</div>
</section>
