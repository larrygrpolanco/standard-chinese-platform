<!-- src/routes/units/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getCompleteUnit } from '$lib/supabase/client';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import UnitContent from '$lib/components/UnitContent.svelte';

	let unitData = null;
	let loading = true;
	let error = null;

	onMount(async () => {
		try {
			const unitId = $page.params.id;
			unitData = await getCompleteUnit(unitId);

			if (!unitData) {
				error = 'Unit not found';
			}
		} catch (err) {
			console.error('Error loading unit:', err);
			error = 'Failed to load unit data';
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>{unitData ? `${unitData.title} | ${unitData.module.title}` : 'Unit'} | FSI Chinese</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
	{#if loading}
		<div class="py-20 text-center">
			<p>Loading unit content...</p>
		</div>
	{:else if error}
		<div class="py-20 text-center">
			<h1 class="mb-4 text-xl text-red-600">{error}</h1>
			<p class="mb-4 text-gray-600">
				The unit you're looking for doesn't exist or has been removed.
			</p>
			<a
				href="/modules"
				class="inline-block rounded bg-[#1A5276] px-4 py-2 font-medium text-white transition-colors hover:bg-[#154360]"
			>
				Browse All Modules
			</a>
		</div>
	{:else}
		<Breadcrumb
			moduleName={`Module ${unitData.module.id}: ${unitData.module.title}`}
			moduleId={unitData.module.id}
			unitName={unitData.title}
		/>

		<header class="mb-6">
			<div class="mb-2 flex items-center">
				<h1 class="text-3xl font-bold text-gray-900">{unitData.title}</h1>
				<span class="ml-3 rounded bg-gray-100 px-2 py-1 text-sm text-gray-600">
					Module {unitData.module.id}
				</span>
			</div>

			{#if unitData.description}
				<p class="text-lg text-gray-600">{unitData.description}</p>
			{/if}
		</header>

		<UnitContent
			unit={unitData}
			vocabulary={unitData.vocabulary}
			reviewTapes={unitData.reviewTapes}
			workbookTapes={unitData.workbookTapes}
			dialogues={unitData.dialogues}
			exercises={unitData.exercises}
		/>
	{/if}
</div>
