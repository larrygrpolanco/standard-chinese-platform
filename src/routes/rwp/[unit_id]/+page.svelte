<!-- src/routes/rwp/[unit_id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import {
		getUnitBasicInfo,
		getUserPreferences,
		getRwpContent,
		saveRwpContent
	} from '$lib/supabase/client';
	import { authStore } from '$lib/stores/authStore';

	const unitId = parseInt($page.params.unit_id);

	let unit = null;
	let preferences = null;
	let rwpContent = null;
	let loading = true;
	let userInput = '';

	onMount(async () => {
		authStore.initialize();

		// Load unit data
		unit = await getUnitBasicInfo(unitId);

		// Only load user data if authenticated
		if ($authStore) {
			[preferences, rwpContent] = await Promise.all([getUserPreferences(), getRwpContent(unitId)]);
		}

		loading = false;
	});

	async function generateRwp() {
		if (!$authStore) {
			alert('Please log in to use this feature');
			return;
		}

		// This would call your backend service that interfaces with an LLM
		// For demo purposes, let's create mock content
		const mockContent = {
			title: 'Restaurant Conversation',
			dialogues: [
				{
					speaker: 'Waiter',
					text: '您好，想吃什么？',
					pinyin: 'Nín hǎo, xiǎng chī shénme?',
					english: 'Hello, what would you like to eat?'
				}
				// More dialogue entries
			],
			questions: [
				{
					question: 'What did the waiter ask?',
					options: ['What time is it?', 'What would you like to eat?', 'Where are you from?'],
					answer: 1
				}
				// More questions
			]
		};

		await saveRwpContent(unitId, mockContent);
		rwpContent = await getRwpContent(unitId);
	}
</script>

<div class="rwp-container">
	{#if loading}
		<p>Loading...</p>
	{:else}
		<h1>Relevant World Practice: {unit.title}</h1>

		{#if !$authStore}
			<div class="login-prompt">
				<p>Please <a href="/login">log in</a> to save your personalized practice.</p>
			</div>
		{:else}
			<div class="rwp-generator">
				<h2>Generate Practice Content</h2>
				<p>Enter details to personalize your practice:</p>

				<textarea
					bind:value={userInput}
					placeholder="Example: I want to practice ordering coffee at a cafe"
				></textarea>

				<button on:click={generateRwp}>Generate Content</button>
			</div>

			{#if rwpContent}
				<div class="generated-content">
					<h2>{rwpContent.content.title}</h2>
					<!-- Display the generated content -->
				</div>
			{/if}
		{/if}
	{/if}
</div>
