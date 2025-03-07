<!-- src/routes/modules/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { getModules } from '$lib/supabase/client';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let modules = [];
	let loading = true;

	onMount(async () => {
		modules = await getModules();
		loading = false;
	});

	// Function to get a color based on module number
	function getModuleAccent(moduleNumber) {
		const colors = [
			'border-[#C17C74]', // Terracotta
			'border-[#7D8C5C]', // Avocado
			'border-[#DDB967]', // Gold
			'border-[#34667F]', // Navy
			'border-[#C17C74]', // Repeat pattern
			'border-[#7D8C5C]',
			'border-[#DDB967]',
			'border-[#34667F]',
			'border-[#C17C74]'
		];
		return colors[(moduleNumber - 1) % colors.length];
	}
</script>

<svelte:head>
	<title>Modules | FSI Chinese</title>
</svelte:head>

<Breadcrumb />

<section class="container mx-auto px-4">
	<header class="mb-10">
		<h1 class="font-['Arvo',serif] text-[2.5rem] font-bold text-[#33312E]">Learning Modules</h1>
		<p class="mt-2 font-['Work_Sans',sans-serif] text-[#A0998A]">
			Explore all 9 core modules of the FSI Standard Chinese course
		</p>
	</header>

	{#if loading}
		<div class="py-20 text-center">
			<p class="text-[#A0998A]">Loading modules...</p>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each modules as module}
				<!-- Module card styled as vintage lesson booklet -->
				<a
					href="/modules/{module.id}"
					class="group relative flex flex-col overflow-hidden rounded-[8px] border border-[#A0998A] bg-[#E8E5D7] transition-all hover:-translate-y-1"
				>
					<!-- Module number badge styled as vintage circular sticker -->
					<div
						class="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-[#F4F1DE] {getModuleAccent(
							module.id
						)}"
					>
						<span class="font-['Arvo',serif] font-bold text-[#33312E]">
							{module.id}
						</span>
					</div>

					<!-- Module content -->
					<div class="p-6 pt-16">
						<h2
							class="mb-2 font-['Arvo',serif] text-xl font-semibold text-[#33312E] transition-colors group-hover:text-[#C17C74]"
						>
							{module.title}
						</h2>

						<!-- Progress indicator styled as vintage meter -->
						<div
							class="mt-4 h-2 w-full overflow-hidden rounded-full border border-[#A0998A] bg-[#F4F1DE]"
						>
							<div class="h-2 w-0 rounded-full bg-[#DDB967]"></div>
						</div>
						<p class="mt-1 text-xs text-[#A0998A]">Not started</p>
					</div>

					<!-- Module description -->
					<div class="flex-grow border-t border-[#A0998A] bg-[#F4F1DE] p-4">
						<p class="line-clamp-3 text-sm text-[#33312E]">
							{module.description}
						</p>
					</div>

					<!-- Call to action -->
					<div class="border-t border-[#A0998A] bg-[#F4F1DE] p-4 text-right">
						<span
							class="inline-flex items-center text-sm font-medium text-[#34667F] group-hover:text-[#C17C74] group-hover:underline"
						>
							Start learning
							<svg
								class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
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
						</span>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</section>
