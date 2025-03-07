<!-- src/lib/components/VocabularyDisplay.svelte -->
<script>
	import ChineseText from './ChineseText.svelte';

	/** @type {Array<{ chinese_simplified: string, chinese_traditional: string, pinyin: string, english: string }>} - Array of vocabulary words. */
	export let vocabulary = [];
</script>

<div>
	<!-- Vocabulary table -->
	{#if vocabulary.length > 0}
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
					{#each vocabulary as word}
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
			<p class="text-gray-500">No vocabulary available for this unit.</p>
		</div>
	{/if}
</div>