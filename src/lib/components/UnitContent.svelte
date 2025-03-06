<script>
	import { createEventDispatcher } from 'svelte';
	import { onMount } from 'svelte';
	import AudioPlayer from './AudioPlayer.svelte';
	import ChineseText from './ChineseText.svelte';

	export let unit; // Expects the complete unit data object

	const dispatch = createEventDispatcher();
	let activeTab = 'vocabulary'; // Default to vocabulary tab
	let simplifiedChinese = true; // Start with simplified Chinese

	function toggleCharacters() {
		simplifiedChinese = !simplifiedChinese;
		dispatch('characterToggle', simplifiedChinese); // Dispatch event if needed in header or elsewhere
	}

	function renderQuestion(question) {
		switch (question.question_type) {
			case 'multiple_choice':
				return renderMultipleChoice(question);
			case 'short_answer':
				return renderShortAnswer(question);
			// case 'table_row': // To be implemented later
			// 	return renderTableQuestion(question);
			default:
				return renderDefault(question);
		}
	}

	function renderMultipleChoice(question) {
		const options = question.options ? question.options.split('|') : [];
		return (
			<div>
				<p class="mb-2">{question.question_text}</p>
				{#each options as option, index}
					<label class="block mb-1">
						<input type="radio" name={`question-${question.id}`} value={index} class="mr-2" />
						{option}
					</label>
				{/each}
			</div>
		);
	}

	function renderShortAnswer(question) {
		return (
			<div>
				<p class="mb-2">{question.question_text}</p>
				<input type="text" class="border p-1 w-full max-w-md" />
			</div>
		);
	}

	function renderDefault(question) {
		return (
			<div>
				<p>{question.question_text} (Question type: {question.question_type}) - Rendering not fully implemented.</p>
			</div>
		);
	}
</script>

<div class="unit-content">
	<div class="bg-gray-100 p-4 mb-4 rounded-md shadow-sm">
		<h2 class="text-xl font-semibold mb-2">Unit {unit.order_num}: {unit.title}</h2>
		{#if unit.description}
			<p class="text-gray-700">{unit.description}</p>
		{/if}
	</div>

	<!-- Character Toggle (for demonstration - move to header later) -->
	<div class="mb-4 flex justify-end">
		<button on:click={toggleCharacters} class="px-2 py-1 bg-blue-500 text-white rounded-md text-sm">
			{simplifiedChinese ? '繁體' : '简体'}
		</button>
	</div>


	<div class="tabs mb-4">
		<button
			class={`tab ${activeTab === 'vocabulary' ? 'active' : ''}`}
			on:click={() => (activeTab = 'vocabulary')}
		>
			Vocabulary
		</button>
		<button
			class={`tab ${activeTab === 'dialogues' ? 'active' : ''}`}
			on:click={() => (activeTab = 'dialogues')}
		>
			Dialogues
		</button>
		<button
			class={`tab ${activeTab === 'reviewTapes' ? 'active' : ''}`}
			on:click={() => (activeTab = 'reviewTapes')}
		>
			Review Tapes
		</button>
		<button
			class={`tab ${activeTab === 'workbookTapes' ? 'active' : ''}`}
			on:click={() => (activeTab = 'workbookTapes')}
		>
			Workbook Tapes & Exercises
		</button>
	</div>

	<div class="tab-content">
		{#if activeTab === 'vocabulary'}
			<section class="py-4">
				<h3 class="text-lg font-semibold mb-3">Vocabulary</h3>
				{#if unit.vocabulary && unit.vocabulary.length > 0}
					<div class="overflow-x-auto">
						<table class="min-w-full border-collapse table-auto">
							<thead>
								<tr class="border-b">
									<th class="py-2 px-4 text-left">Chinese</th>
									<th class="py-2 px-4 text-left">Pinyin</th>
									<th class="py-2 px-4 text-left">English</th>
								</tr>
							</thead>
							<tbody>
								{#each unit.vocabulary as vocabWord}
									<tr class="border-b hover:bg-gray-50">
										<td class="py-2 px-4">
											<ChineseText
												simplified={simplifiedChinese}
												simplifiedText={vocabWord.chinese_simplified}
												traditionalText={vocabWord.chinese_traditional}
											/>
										</td>
										<td class="py-2 px-4">{vocabWord.pinyin}</td>
										<td class="py-2 px-4">{vocabWord.english}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<p>No vocabulary words found for this unit.</p>
				{/if}
			</section>
		{/if}

		{#if activeTab === 'dialogues'}
			<section class="py-4">
				<h3 class="text-lg font-semibold mb-3">Dialogues (Reference List)</h3>

				{#if unit.reviewTapes && unit.reviewTapes.length > 0}
					<div class="mb-4">
						<h4 class="font-semibold">Review Tapes</h4>
						<div class="flex space-x-2">
							{#each unit.reviewTapes as tape}
								<AudioPlayer audioFile={tape.audio_file} title={tape.title} />
							{/each}
						</div>
					</div>
				{/if}


				{#if unit.referenceList && unit.referenceList.length > 0}
					<div class="space-y-6">
						{#each unit.referenceList as dialogue}
							<div class="dialogue-item bg-white p-4 rounded-md shadow-sm">
								<h4 class="font-semibold mb-2">Dialogue {dialogue.number}</h4>
								<ChineseText
									simplified={simplifiedChinese}
									simplifiedText={dialogue.chinese_simplified}
									traditionalText={dialogue.chinese_traditional}
									pinyin={dialogue.pinyin}
									english={dialogue.english}
									speakerLabels={true} // Enable speaker labels
								/>
								{#if dialogue.notes}
									<details class="mt-3">
										<summary class="text-blue-500 hover:underline cursor-pointer">Notes</summary>
										<div class="p-2 bg-gray-50 rounded-md mt-1">{dialogue.notes}</div>
									</details>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<p>No dialogues found for this unit.</p>
				{/if}
			</section>
		{/if}

		{#if activeTab === 'reviewTapes'}
			<section class="py-4">
				<h3 class="text-lg font-semibold mb-3">Review Tapes</h3>
				{#if unit.reviewTapes && unit.reviewTapes.length > 0}
					<div class="flex flex-col space-y-4">
						{#each unit.reviewTapes as tape}
							<div class="tape-item bg-white p-4 rounded-md shadow-sm">
								<h4 class="font-semibold mb-2">{tape.title}</h4>
								<AudioPlayer audioFile={tape.audio_file} title={tape.title} />
							</div>
						{/each}
					</div>
				{:else}
					<p>No review tapes found for this unit.</p>
				{/if}
			</section>
		{/if}

		{#if activeTab === 'workbookTapes'}
			<section class="py-4">
				<h3 class="text-lg font-semibold mb-3">Workbook Tapes & Exercises</h3>
				{#if unit.workbookTapes && unit.workbookTapes.length > 0}
					<div class="space-y-6">
						{#each unit.workbookTapes as tape}
							<div class="tape-section bg-white p-4 rounded-md shadow-sm">
								<h4 class="text-lg font-semibold mb-3">Workbook Tape: {tape.title}</h4>
								<AudioPlayer audioFile={tape.audio_file} title={tape.title} />

								{#if tape.exercises && tape.exercises.length > 0}
									<div class="exercises space-y-4 mt-4">
										{#each tape.exercises as exercise}
											<div class="exercise-item p-3 border rounded-md">
												<h5 class="font-semibold mb-2">{exercise.title} ({exercise.exercise_type})</h5>
												{#if exercise.instructions}
													<p class="mb-2">{exercise.instructions}</p>
												{/if}
												{#if exercise.display_url}
													<div class="mb-2">
														<img src={exercise.display_url} alt="Exercise Display" class="max-w-xs h-auto rounded-md" />
													</div>
												{/if}
												{#if exercise.questions && exercise.questions.length > 0}
													<div class="questions space-y-3 mt-3">
														{#each exercise.questions as question}
															<div class="question-item p-2 border-b last:border-b-0">
																{renderQuestion(question)}
															</div>
														{/each}
													</div>
												{/if}
											</div>
										{/each}
									</div>
								{:else}
									<p>No exercises found for this tape.</p>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<p>No workbook tapes found for this unit.</p>
				{/if}
			</section>
		{/if}
	</div>
</div>

<style>
	.unit-content {
		@apply p-6;
	}

	.tabs {
		@apply flex border-b border-gray-200 mb-4;
	}

	.tab {
		@apply px-4 py-2 -mb-px font-semibold text-gray-800 border-b-2 border-transparent hover:text-blue-500 hover:border-blue-500 cursor-pointer;
	}

	.tab.active {
		@apply border-blue-500 text-blue-600;
	}

	.tab-content {
		@apply py-4;
	}

	.dialogue-item {
		@apply mb-6;
	}
</style>
