<!-- src/routes/units/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getCompleteUnit } from '$lib/supabase/client';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
	import UnitContent from '$lib/components/UnitContent.svelte';
	import Loader from '$lib/components/Loader.svelte';

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

<div class="mx-auto max-w-6xl px-4 py-8 font-sans sm:px-6 lg:px-8">
	{#if loading}
		<Loader />
	{:else if error}
		<div class="py-20 text-center">
			<h1 class="text-terracotta mb-4 font-serif text-xl">{error}</h1>
			<p class="text-charcoal mb-4">
				The unit you're looking for doesn't exist or has been removed.
			</p>
			<a
				href="/modules"
				class="bg-terracotta text-cream-paper border-terracotta/50 inline-block rounded-lg border px-4 py-2 font-medium transition-all hover:-translate-y-1 active:translate-y-0"
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

		<header class="border-warm-gray mb-6 border-b pb-4">
			<div class="mb-2 flex flex-wrap items-center gap-3">
				<h1 class="text-2.5rem text-charcoal font-serif font-bold">{unitData.title}</h1>
				<span
					class="bg-beige border-warm-gray text-charcoal rounded-lg border px-3 py-1 text-sm"
					style="transform: rotate(-1deg);"
				>
					Module {unitData.module.id}
				</span>
			</div>

			{#if unitData.description}
				<p class="text-charcoal mt-2 text-lg">{unitData.description}</p>
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
