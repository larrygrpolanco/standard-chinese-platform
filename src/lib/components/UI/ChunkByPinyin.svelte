<script>
	export let text = '';
	export let pinyin = '';
	export let customClass = '';

	// Simple function to split text by major punctuation marks
	function createChunks(chineseText, pinyinText) {
		// Split both texts by newlines to preserve paragraph structure
		const chineseLines = chineseText.split('\n');
		const pinyinLines = pinyinText.split('\n');

		const chunks = [];

		// Process each line pair
		const maxLines = Math.min(chineseLines.length, pinyinLines.length);

		for (let i = 0; i < maxLines; i++) {
			const chineseLine = chineseLines[i].trim();
			const pinyinLine = pinyinLines[i].trim();

			if (chineseLine.length === 0) continue;

			// Define punctuation to break on
			const breakPunctuation = "。！？，；：.!?,;:";
			
			// Split Chinese line into chunks
			let chineseChunks = [];
			let currentChunk = '';
			
			for (let j = 0; j < chineseLine.length; j++) {
				currentChunk += chineseLine[j];
				if (breakPunctuation.includes(chineseLine[j])) {
					chineseChunks.push(currentChunk.trim());
					currentChunk = '';
				}
			}
			
			// Add any remaining text
			if (currentChunk.trim()) {
				chineseChunks.push(currentChunk.trim());
			}
			
			// For very short lines or lines with no punctuation, use the whole line
			if (chineseChunks.length <= 1 || chineseLine.length < 10) {
				chunks.push({
					text: chineseLine,
					pinyin: pinyinLine
				});
				continue;
			}

			// Split pinyin into chunks too
			let pinyinChunks = [];
			currentChunk = '';
			
			for (let j = 0; j < pinyinLine.length; j++) {
				currentChunk += pinyinLine[j];
				if (breakPunctuation.includes(pinyinLine[j])) {
					pinyinChunks.push(currentChunk.trim());
					currentChunk = '';
				}
			}
			
			// Add any remaining pinyin
			if (currentChunk.trim()) {
				pinyinChunks.push(currentChunk.trim());
			}

			// Create aligned chunks
			for (let j = 0; j < Math.min(chineseChunks.length, pinyinChunks.length); j++) {
				chunks.push({
					text: chineseChunks[j],
					pinyin: pinyinChunks[j]
				});
			}
			
			// Handle remaining Chinese chunks if there are more than pinyin chunks
			for (let j = pinyinChunks.length; j < chineseChunks.length; j++) {
				chunks.push({
					text: chineseChunks[j],
					pinyin: ''
				});
			}
		}

		// Handle any remaining Chinese lines without pinyin
		for (let i = maxLines; i < chineseLines.length; i++) {
			const line = chineseLines[i].trim();
			if (line.length > 0) {
				chunks.push({
					text: line,
					pinyin: ''
				});
			}
		}

		return chunks;
	}

	$: chunks = createChunks(text, pinyin);
</script>

<div class="chunk-container vintage-text">
	{#each chunks as chunk}
		<div class="chunk">
			<div class="pinyin-text">{chunk.pinyin}</div>
			<div class="chinese-text {customClass}">{chunk.text}</div>
		</div>
	{/each}
</div>

<style>
	.chunk-container {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.5rem;
		width: 100%;
	}

	.chunk {
		display: flex;
		flex-direction: column;
		margin-bottom: 0.5rem;
		padding-right: 0.5rem;
		margin-right: 0.25rem;
		border-right: 1px solid rgba(160, 152, 138, 0.15);
	}

	.chunk:last-child {
		border-right: none;
	}

	.pinyin-text {
		font-family: 'Work Sans', sans-serif;
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.8rem;
		line-height: 1.4;
		white-space: pre-wrap;
	}

	.chinese-text {
		font-family: 'Noto Sans SC', 'Noto Sans TC', sans-serif;
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--color-charcoal, #33312e);
		white-space: pre-wrap;
	}

	@media (max-width: 640px) {
		.chunk-container {
			gap: 0.25rem;
		}

		.chunk {
			margin-bottom: 0.25rem;
		}

		.pinyin-text {
			font-size: 0.75rem;
		}

		.chinese-text {
			font-size: 1rem;
		}
	}
</style>
