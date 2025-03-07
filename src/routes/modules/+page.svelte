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

	// Function to get a color based on module number (for visual variety)
	function getModuleColor(moduleNumber) {
		const colors = [
			'bg-blue-100 border-blue-300',
			'bg-green-100 border-green-300',
			'bg-purple-100 border-purple-300',
			'bg-yellow-100 border-yellow-300',
			'bg-pink-100 border-pink-300',
			'bg-indigo-100 border-indigo-300',
			'bg-red-100 border-red-300',
			'bg-teal-100 border-teal-300',
			'bg-orange-100 border-orange-300'
		];

		return colors[(moduleNumber - 1) % colors.length];
	}
</script>

<svelte:head>
	<title>Modules | FSI Chinese</title>
</svelte:head>

<Breadcrumb />

<section>
	<header class="mb-10">
		<h1 class="text-3xl font-bold text-[#1A5276]">Learning Modules</h1>
		<p class="mt-2 text-gray-600">Explore all 9 core modules of the FSI Standard Chinese course</p>
	</header>

	{#if loading}
		<div class="py-20 text-center">
			<p>Loading modules...</p>
		</div>
	{:else}
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each modules as module}
				<a
					href="/modules/{module.id}"
					class="group relative flex flex-col overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
				>
					<!-- Module number badge -->
					<div
						class="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-white shadow {getModuleColor(
							module.id
						)}"
					>
						<span class="font-bold text-gray-700">
							{module.id}
						</span>
					</div>

					<!-- Module content -->
					<div class="p-6 pt-16 {getModuleColor(module.id)}">
						<h2
							class="mb-2 text-xl font-semibold text-gray-800 transition-colors group-hover:text-[#1A5276]"
						>
							{module.title}
						</h2>

						<!-- Progress indicator (placeholder for future functionality) -->
						<div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-white">
							<div class="h-2 w-0 rounded-full bg-gray-300"></div>
						</div>
						<p class="mt-1 text-xs text-gray-500">Not started</p>
					</div>

					<!-- Module description -->
					<div class="flex-grow border-t border-gray-100 bg-white p-4">
						<p class="line-clamp-3 text-sm text-gray-600">
							{module.description}
						</p>
					</div>

					<!-- Call to action -->
					<div class="border-t border-gray-100 bg-gray-50 p-4 text-right">
						<span
							class="inline-flex items-center text-sm font-medium text-[#1A5276] group-hover:underline"
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
