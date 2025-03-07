<!-- src/routes/modules/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getModuleById, getUnitsByModuleId } from '$lib/supabase/client';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let module = null;
	let units = [];
	let loading = true;

	onMount(async () => {
		const moduleId = $page.params.id;
		module = await getModuleById(moduleId);
		if (module) {
			units = await getUnitsByModuleId(moduleId);
		}
		loading = false;
	});

	// Generate an emoji for each unit to make them visually distinct
	function getUnitEmoji(index) {
		const emojis = ['📝', '🗣️', '🎧', '🔍', '📚', '🗺️', '💬', '✏️'];
		return emojis[index % emojis.length];
	}
</script>

<svelte:head>
	<title>{module?.title || 'Module'} | FSI Chinese</title>
</svelte:head>

{#if loading}
	<div class="py-20 text-center">
		<p>Loading module content...</p>
	</div>
{:else if module}
	<Breadcrumb moduleName={`Module ${module.id}: ${module.title}`} />

	<div class="mx-auto max-w-4xl">
		<header class="mb-10">
			<div class="mb-4 flex items-center">
				<div
					class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1A5276] text-white"
				>
					<span class="text-lg font-bold">{module.id}</span>
				</div>
				<h1 class="text-3xl font-bold text-gray-900">{module.title}</h1>
			</div>

			<p class="text-lg leading-relaxed text-gray-600">{module.description}</p>
		</header>

		<!-- Learning objectives (example - could be populated from database in future) -->
		<section class="mb-10 rounded-lg border border-blue-100 bg-blue-50 p-6">
			<h2 class="mb-4 text-xl font-semibold text-[#1A5276]">What You'll Learn</h2>
			<ul class="space-y-2">
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
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
					<span>Key vocabulary and phrases for {module.title.toLowerCase()}</span>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
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
					<span>Essential grammar patterns and structures</span>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
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
					<span>Authentic dialogues with native speakers</span>
				</li>
				<li class="flex">
					<svg
						class="mr-2 h-5 w-5 flex-shrink-0 text-blue-500"
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
					<span>Practical exercises to reinforce your learning</span>
				</li>
			</ul>
		</section>

		<!-- Units listing -->
		<section class="mb-12">
			<h2 class="mb-6 text-2xl font-semibold text-gray-900">Module Units</h2>

			{#if units.length > 0}
				<div class="space-y-4">
					{#each units as unit, index}
						<a
							href="/units/{unit.id}"
							class="block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#1A5276] hover:shadow-md sm:p-6"
						>
							<div class="flex items-start">
								<div class="mr-4 text-2xl sm:mr-6">{getUnitEmoji(index)}</div>
								<div class="flex-grow">
									<div class="mb-2 flex items-center justify-between">
										<h3 class="text-lg font-semibold text-gray-900">{unit.title}</h3>
										<span class="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
											Unit {index + 1}
										</span>
									</div>
									<p class="mb-3 text-sm text-gray-600">
										{unit.description || 'Learn key language skills and vocabulary in this unit.'}
									</p>

									<!-- Unit content preview -->
									<div class="mb-3 flex flex-wrap gap-2">
										<span
											class="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs text-blue-700"
										>
											<svg
												class="mr-1 h-3 w-3"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
												/>
											</svg>
											Audio Dialogues
										</span>
										<span
											class="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs text-green-700"
										>
											<svg
												class="mr-1 h-3 w-3"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
												/>
											</svg>
											Vocabulary
										</span>
										<span
											class="inline-flex items-center rounded bg-purple-50 px-2 py-1 text-xs text-purple-700"
										>
											<svg
												class="mr-1 h-3 w-3"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
												/>
											</svg>
											Exercises
										</span>
									</div>

									<!-- Call to action -->
									<div class="flex justify-end">
										<span class="inline-flex items-center text-sm font-medium text-[#1A5276]">
											Start unit
											<svg
												class="ml-1 h-4 w-4"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M9 5l7 7-7 7"
												/>
											</svg>
										</span>
									</div>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
					<p class="text-gray-500">No units found in this module.</p>
					<a href="/modules" class="mt-2 inline-block font-medium text-[#1A5276] hover:underline">
						Return to all modules
					</a>
				</div>
			{/if}
		</section>
	</div>
{:else}
	<div class="py-20 text-center">
		<h1 class="mb-4 text-xl text-red-600">Module Not Found</h1>
		<p class="mb-4 text-gray-600">
			The module you're looking for doesn't exist or has been removed.
		</p>
		<a
			href="/modules"
			class="inline-block rounded bg-[#1A5276] px-4 py-2 font-medium text-white transition-colors hover:bg-[#154360]"
		>
			Browse All Modules
		</a>
	</div>
{/if}
