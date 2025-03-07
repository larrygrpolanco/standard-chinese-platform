<!-- src/lib/components/VocabularyDisplay.svelte -->
<script>
	import ChineseText from './ChineseText.svelte';

	// Props
	export let vocabulary = [];

	// Search functionality
	let searchTerm = '';

	// Filter vocabulary based on search
	$: filteredVocabulary = searchTerm
		? vocabulary.filter(
				(word) =>
					word.chinese_simplified.includes(searchTerm) ||
					word.pinyin.toLowerCase().includes(searchTerm.toLowerCase()) ||
					word.english.toLowerCase().includes(searchTerm.toLowerCase())
			)
		: vocabulary;
</script>

<div>
	<!-- Search bar -->
	<div class="mb-4">
		<div class="relative">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search vocabulary..."
				class="w-full rounded-md border border-gray-300 p-2 pl-9"
			/>
			<svg
				class="absolute top-2.5 left-3 h-4 w-4 text-gray-400"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</div>
	</div>

	<!-- Vocabulary table -->
	{#if filteredVocabulary.length > 0}
		<div class="overflow-x-auto">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Chinese
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							Pinyin
						</th>
						<th
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
						>
							English
						</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each filteredVocabulary as word}
						<tr class="hover:bg-gray-50">
							<td class="px-6 py-4 text-base whitespace-nowrap">
								<ChineseText
									simplified={word.chinese_simplified}
									traditional={word.chinese_traditional}
									showPinyin={false}
								/>
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{word.pinyin}
							</td>
							<td class="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
								{word.english}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="rounded-lg border border-gray-200 bg-white p-8 text-center">
			{#if searchTerm}
				<p class="text-gray-500">No vocabulary matches your search.</p>
			{:else}
				<p class="text-gray-500">No vocabulary available for this unit.</p>
			{/if}
		</div>
	{/if}
</div>
