<!-- src/lib/components/rwp/VocabularySection.svelte -->
<script>
	import ChineseText from '$lib/components/UI/ChineseText.svelte';

	export let vocabulary = [];
</script>

<!-- Traditional will use same content for now -->
<div class="vocabulary-container">
	<h3 class="vocabulary-title">Key Vocabulary</h3>
	<div class="vocabulary-list">
		{#each vocabulary as vocab}
			<div class="vocabulary-item">
				<ChineseText
					simplified={vocab.word}
					traditional={vocab.word}
					pinyin={vocab.pinyin}
					english={vocab.english}
				/>
				{#if vocab.usage_example}
					<div class="vocab-example">{vocab.usage_example}</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	.vocabulary-container {
		margin-bottom: 2rem;
	}

	.vocabulary-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
		margin-bottom: 0.75rem;
		padding-bottom: 0.375rem;
		border-bottom: 1px solid #e8e5d7;
	}

	.vocabulary-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}

	.vocabulary-item {
		padding: 0.75rem;
		border-radius: 0.375rem;
		border: 1px solid #e8e5d7;
		background-color: #f9f8f4;
	}

	.vocab-example {
		margin-top: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px dashed #e8e5d7;
		font-size: 0.875rem;
	}
</style>
