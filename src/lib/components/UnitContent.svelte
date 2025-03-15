<!-- src/lib/components/UnitContent.svelte -->
<script>
	import { fade } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';
	import { getUnitExercisesData } from '$lib/supabase/client';
	import { supabase } from '$lib/supabase/client';
	import TabSelector from './UI/TabSelector.svelte';
	import ReviewTab from './ReviewTab.svelte';
	import ExercisesTab from './ExercisesTab.svelte';
	import VocabularyTab from './VocabularyTab.svelte';

	const dispatch = createEventDispatcher();

	// Props
	export let unit;
	export let vocabulary = [];
	export let tapes = [];
	export let dialogues = [];
	export let exercises = [];
	export let activeTab = 'vocabulary';

	// Direct data for exercises tab
	let directWorkbookTapes = [];
	let directExercises = [];
	let isLoadingExercisesData = false;
	let hasFetchedExercisesData = false;

	// Direct data for vocabulary tab
	let directVocabulary = [];
	let isLoadingVocabulary = false;
	let hasFetchedVocabulary = false;

	$: reviewTapes = tapes.filter((tape) => tape.tape_type === 'review');
	$: workbookTapes = tapes.filter((tape) => tape.tape_type === 'workbook');

	// Fetch exercises data when tab changes or on initial load
	$: if (
		activeTab === 'exercises' &&
		unit?.id &&
		!hasFetchedExercisesData &&
		!isLoadingExercisesData
	) {
		fetchExercisesData(unit.id);
	}

	// Fetch vocabulary data when tab changes or on initial load
	$: if (activeTab === 'vocabulary' && unit?.id && !hasFetchedVocabulary && !isLoadingVocabulary) {
		fetchVocabularyDirectly(unit.id);
	}

	// Tab data for easier management
	const tabs = [
		{
			id: 'vocabulary',
			label: 'Vocabulary',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
		},
		{
			id: 'review',
			label: 'Review',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>`
		},
		{
			id: 'exercises',
			label: 'Exercises',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
		},
	];

	// Handle tab change and dispatch event up to parent
	function handleTabChange(event) {
		const newTab = event.detail.tabId;
		if (newTab !== activeTab) {
			dispatch('tabChange', { tabId: newTab });
		}
	}

	// Fetch exercises data directly from Supabase
	async function fetchExercisesData(unitId) {
		console.log('Directly fetching exercises data for unit:', unitId);
		isLoadingExercisesData = true;

		try {
			const { workbookTapes, exercises } = await getUnitExercisesData(unitId);

			directWorkbookTapes = workbookTapes;
			directExercises = exercises;
			hasFetchedExercisesData = true;

			console.log('Directly fetched workbook tapes:', directWorkbookTapes.length);
			console.log('Directly fetched exercises:', directExercises.length);
		} catch (error) {
			console.error('Error directly fetching exercises data:', error);
		} finally {
			isLoadingExercisesData = false;
		}
	}

	// Fetch vocabulary data directly from Supabase
	async function fetchVocabularyDirectly(unitId) {
		console.log('Directly fetching vocabulary for unit:', unitId);
		isLoadingVocabulary = true;

		try {
			const { data, error } = await supabase
				.from('vocabulary')
				.select('*')
				.eq('unit_id', unitId)
				.order('order_num');

			if (error) {
				console.error('Error fetching vocabulary:', error);
			} else {
				directVocabulary = data || [];
				hasFetchedVocabulary = true;
				console.log('Directly fetched vocabulary:', directVocabulary.length);
			}
		} catch (error) {
			console.error('Error directly fetching vocabulary data:', error);
		} finally {
			isLoadingVocabulary = false;
		}
	}

	// Forward exercise change event from ExercisesTab
	function handleExerciseChange(event) {
		dispatch('exerciseChange', event.detail);
	}
</script>

<div class="unit-content overflow-hidden rounded-lg border border-[#A0998A] bg-[#E8E5D7]">
	<TabSelector {tabs} bind:activeTab on:tabChange={handleTabChange} />

	<div class="content-area">
		{#key activeTab}
			<div transition:fade={{ duration: 200 }}>
				{#if activeTab === 'review'}
					<h3 class="section-header">Listening & Speaking Tapes</h3>
					<ReviewTab {dialogues} tapes={reviewTapes} />
				{:else if activeTab === 'exercises'}
                <h3 class="section-header">Exercise Tapes</h3>
					{#if isLoadingExercisesData}
						<div class="loading-state p-4 text-center">
							<p>Loading workbook tapes and exercises...</p>
						</div>
					{:else}
						<ExercisesTab
							exercises={directExercises.length > 0 ? directExercises : exercises}
							tapes={directWorkbookTapes.length > 0 ? directWorkbookTapes : workbookTapes}
							on:exerciseChange={handleExerciseChange}
						/>
					{/if}
				{:else if activeTab === 'vocabulary'}
					<h3 class="section-header">Vocabulary List</h3>
					{#if isLoadingVocabulary}
						<div class="loading-state p-4 text-center">
							<p>Loading vocabulary...</p>
						</div>
					{:else}
						<VocabularyTab
							vocabulary={directVocabulary.length > 0 ? directVocabulary : vocabulary}
						/>
					{/if}
				{/if}
			</div>
		{/key}
	</div>
</div>

<style>
	.unit-content {
		position: relative;
		background-color: var(--color-beige, #e8e5d7);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		overflow: hidden;
		background-image: url('/textures/subtle-paper.png');
		background-repeat: repeat;
		margin-bottom: 32px; /* Add bottom margin to create space */
	}

	.content-area {
		padding: 24px;
		min-height: 450px;
		position: relative;
	}

	.section-header {
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-charcoal, #33312e);
		margin-bottom: 24px;
		position: relative;
		padding-bottom: 8px;
	}

	.section-header::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 60px;
		height: 3px;
		background-color: var(--color-gold, #ddb967);
	}

	@media (max-width: 768px) {
		.content-area {
			padding: 16px;
			min-height: 350px; /* Adjusted for mobile */
		}

		.section-header {
			font-size: 1.25rem;
		}
	}
</style>
