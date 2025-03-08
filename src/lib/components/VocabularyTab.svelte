<!-- VocabularyTab.svelte -->
<script>
	import ChineseText from './ChineseText.svelte';

	/** @type {Array<{ chinese_simplified: string, chinese_traditional: string, pinyin: string, english: string }>} */
	export let vocabulary = [];
</script>

<div class="vocabulary-display">
	<!-- Vocabulary table -->
	{#if vocabulary.length > 0}
		<div class="table-wrapper">
			<table class="vocabulary-table">
				<thead>
					<tr>
						<th class="simplified-column">Simplified</th>
						<th class="traditional-column">Traditional</th>
						<th class="pinyin-column">Pinyin</th>
						<th class="english-column">English</th>
					</tr>
				</thead>
				<tbody>
					{#each vocabulary as word}
						<tr>
							<td class="chinese-cell">
								<span class="chinese-text" lang="zh">{word.chinese_simplified}</span>
							</td>
							<td class="chinese-cell">
								<span class="chinese-text" lang="zh">{word.chinese_traditional}</span>
							</td>
							<td class="pinyin-cell">
								{word.pinyin}
							</td>
							<td class="english-cell">
								{word.english}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<div class="empty-vocabulary">
			<p>No vocabulary available for this unit.</p>
		</div>
	{/if}
</div>

<style>
	.vocabulary-display {
		width: 100%;
	}

	.table-wrapper {
		overflow-x: auto;
		border-radius: 8px;
		border: 1px solid var(--color-warm-gray, #a0998a);
		background-color: var(--color-cream-paper, #f4f1de);
		background-image: url('/textures/subtle-paper.png');
		background-repeat: repeat;
	}

	.vocabulary-table {
		width: 100%;
		border-collapse: collapse;
		font-family: 'Work Sans', sans-serif;
	}

	.vocabulary-table th {
		padding: 12px 16px;
		text-align: left;
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 1px;
		color: var(--color-charcoal, #33312e);
		border-bottom: 2px solid var(--color-avocado, #7d8c5c);
		background-color: rgba(125, 140, 92, 0.1);
		font-weight: 600;
	}

	.vocabulary-table td {
		padding: 12px 16px;
		border-bottom: 1px solid var(--color-warm-gray, #a0998a);
	}

	.vocabulary-table tr:last-child td {
		border-bottom: none;
	}

	.vocabulary-table tr:hover {
		background-color: rgba(193, 124, 116, 0.05);
	}

	/* Column width ratio: 
	   - Simplified, Traditional, Pinyin equally sharing 2/3 of the width
	   - English taking 1/3 of the width */
	.simplified-column {
		width: 22.22%; /* 2/9 of the table (2/3 ÷ 3) */
	}

	.traditional-column {
		width: 22.22%; /* 2/9 of the table (2/3 ÷ 3) */
	}

	.pinyin-column {
		width: 22.22%; /* 2/9 of the table (2/3 ÷ 3) */
	}

	.english-column {
		width: 33.33%; /* 1/3 of the table */
	}

	.chinese-cell {
		font-size: 1em;
	}

	.chinese-text {
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
		color: var(--color-charcoal, #33312e);
	}

	.pinyin-cell {
		color: var(--color-warm-gray, #a0998a);
		font-style: italic;
	}

	.english-cell {
		color: var(--color-charcoal, #33312e);
	}

	.empty-vocabulary {
		padding: 40px 24px;
		text-align: center;
		background-color: var(--color-cream-paper, #f4f1de);
		border: 1px dashed var(--color-warm-gray, #a0998a);
		border-radius: 8px;
		color: var(--color-warm-gray, #a0998a);
		font-style: italic;
	}
</style>
