<!-- src/lib/components/rwp/ComprehensionExercise.svelte -->
<script>
	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import ChineseText from '$lib/components/UI/ChineseText.svelte';
	import FontToggle from '$lib/components/UI/FontToggle.svelte';
	import TabSelector from '$lib/components/UI/TabSelector.svelte';
	import QuizTab from './QuizTab.svelte';
	import ListeningTab from './ListeningTab.svelte';
	import VocabularyTab from '$lib/components/VocabularyTab.svelte';

	// Props
	export let content = {}; // The content JSON
	export let showAnswers = false; // Whether to show answers
	export let vocabulary = []; // Unit vocabulary for the vocabulary tab

	const dispatch = createEventDispatcher();

	// Tab management
	let activeTab = 'quiz';

	// Tab definitions for TabSelector
	const tabs = [
		{
			id: 'quiz',
			label: 'Quiz',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`
		},
		{
			id: 'listening',
			label: 'Listening',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>`
		},
		{
			id: 'vocabulary',
			label: 'Vocabulary',
			icon: `<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
		}
	];

	// Handle tab change
	function handleTabChange(event) {
		activeTab = event.detail.tabId;
	}
</script>

<div class="reading-exercise">
	<!-- Title and introduction -->
	<div class="exercise-header">
		<h2 class="exercise-title">
			<ChineseText
				simplified={content.meta?.title || ''}
				traditional={content.meta?.title_traditional || ''}
				pinyin={content.meta?.title_pinyin || ''}
				english={content.meta?.title_english || ''}
				containerClass="title-container"
				chineseClass="title-chinese-text"
				englishClass="title-english-text"
			/>
		</h2>
		{#if content.meta?.introduction}
			<p class="exercise-intro">{content.meta.introduction}</p>
		{/if}
	</div>

	<!-- Font toggle -->
	<div class="font-controls">
		<FontToggle />
	</div>

	<!-- Reading passage section - ALWAYS VISIBLE -->
	<div class="reading-section">
		<h3 class="section-title">Reading Passage</h3>
		<div class="reading-content">
			<ChineseText
				simplified={content.story?.text || ''}
				traditional={content.story?.text_traditional || ''}
				pinyin={content.story?.text_pinyin || ''}
				english={content.story?.text_english || ''}
			/>
		</div>
	</div>

	<!-- Tab selection -->
	<div class="tabs-container">
		<TabSelector {tabs} bind:activeTab on:tabChange={handleTabChange} />

		<!-- Tab content area -->
		<div class="tab-content">
			{#key activeTab}
				<div transition:fade={{ duration: 200 }}>
					{#if activeTab === 'quiz'}
						<QuizTab
							{content}
							{showAnswers}
							on:toggleAnswers={(e) => {
								showAnswers = e.detail;
								dispatch('toggleAnswers', showAnswers);
							}}
						/>
					{:else if activeTab === 'listening'}
						<ListeningTab {content} />
					{:else if activeTab === 'vocabulary'}
						<VocabularyTab {vocabulary} />
					{/if}
				</div>
			{/key}
		</div>
	</div>
</div>

<style>
	/* Main container styling with vintage paper effect */
	.reading-exercise {
		font-family: 'Work Sans', sans-serif;
		margin: 0 auto;
		padding: 1.5rem;
		background-color: var(--color-cream-paper, #f4f1de);
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
		box-shadow:
			0 1px 3px rgba(51, 49, 46, 0.1),
			0 4px 6px rgba(0, 0, 0, 0.03);
		/* border-radius: 8px; */
		/* border: 1px solid var(--color-warm-gray, #A0998A); */
	}

	/* Header styling - updated */
	.exercise-header {
		margin-bottom: 24px;
		position: relative;
	}

	.exercise-title {
		font-family: 'Arvo', serif;
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-terracotta, #c17c74);
		margin-bottom: 12px;
		position: relative;
		padding-bottom: 8px;
	}

	.exercise-title::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 60px;
		height: 3px;
		background-color: var(--color-gold, #ddb967);
	}

	.exercise-intro {
		font-style: italic;
		color: var(--color-warm-gray, #a0998a);
		margin-top: 8px;
		line-height: 1.5;
		font-size: 0.95rem;
		max-width: 95%;
	}

	.title-container {
		margin-bottom: 0.5rem;
	}

	/* Use :global() to target elements rendered by child components */
	:global(.title-chinese-text) {
		font-family:
			'Arvo', serif !important; /* !important may be needed to override component styles */
		font-size: 2rem !important;
		font-weight: 700 !important;
		color: var(--color-terracotta, #c17c74) !important;
	}

	:global(.title-english-text) {
		font-style: italic !important;
		font-size: 1.2rem !important;
		color: var(--color-terracotta, #c17c74) !important;
		opacity: 0.85 !important;
	}

	/* Font controls styling */
	.font-controls {
		margin-bottom: 1.25rem;
	}

	/* Section titles */
	.section-title {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-navy, #34667f);
		margin: 1.25rem 0 0.75rem 0;
		padding-bottom: 0.375rem;
		border-bottom: 2px dotted var(--color-gold, #ddb967);
	}

	/* Reading content styling with vintage lined paper effect */
	.reading-content {
		background-color: #fcf9f0;
		background-image: linear-gradient(rgba(220, 220, 220, 0.25) 1px, transparent 1px);
		background-size: 100% 1.6rem;
		padding: 1.25rem;
		border-radius: 8px;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.1),
			inset 0 1px 0 rgba(255, 255, 255, 0.9);
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-left: 3px solid var(--color-terracotta, #c17c74);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	/* Tab content area */
	.tabs-container {
		margin-top: 1.5rem;
	}

	.tab-content {
		margin-top: 0.5rem;
		min-height: 300px;
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.reading-exercise {
			padding: 1rem 0.75rem;
		}

		.exercise-title {
			font-size: 1.25rem;
		}

		.section-title {
			font-size: 1.125rem;
			margin-top: 1rem;
		}

		.reading-content {
			padding: 1rem;
		}
	}
</style>
