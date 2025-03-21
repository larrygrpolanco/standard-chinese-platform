<!-- src/lib/components/UI/ChunkByPinyin.svelte (further refined) -->
<script>
	export let text = '';
	export let pinyin = '';
	export let customClass = '';

	// Function to align chunks with special handling for dialogue
	function alignChunks(chineseText, pinyinText) {
		// First, split both texts by newlines to ensure paragraph alignment
		const chineseLines = chineseText.split('\n');
		const pinyinLines = pinyinText.split('\n');

		const alignedChunks = [];

		// Process each line pair
		const maxLines = Math.min(chineseLines.length, pinyinLines.length);

		for (let i = 0; i < maxLines; i++) {
			const chineseLine = chineseLines[i].trim();
			const pinyinLine = pinyinLines[i].trim();

			if (chineseLine.length === 0) continue;

			// First, let's identify quotation parts in the Chinese text
			const quoteRegex = /(["'"」「][^"'"」「]*["'"」「])/g;
			const quoteParts = [...chineseLine.matchAll(quoteRegex)].map((match) => ({
				text: match[0],
				startIndex: match.index,
				endIndex: match.index + match[0].length
			}));

			// Regular punctuation splitting, but be careful around quotes
			let chineseChunks = [];
			let lastIndex = 0;

			// Create a regex that matches punctuation but not inside quotes
			const punctuationRegex = /[，,。！？…：；]/g;
			let match;

			while ((match = punctuationRegex.exec(chineseLine)) !== null) {
				const matchIndex = match.index;

				// Check if this punctuation is inside a quote
				const isInQuote = quoteParts.some(
					(part) => matchIndex > part.startIndex && matchIndex < part.endIndex
				);

				if (!isInQuote) {
					// This is a valid punctuation break point
					const chunk = chineseLine.substring(lastIndex, matchIndex + 1);
					if (chunk.trim()) {
						chineseChunks.push(chunk);
					}
					lastIndex = matchIndex + 1;
				}
			}

			// Don't forget the last part
			if (lastIndex < chineseLine.length) {
				const chunk = chineseLine.substring(lastIndex);
				if (chunk.trim()) {
					chineseChunks.push(chunk);
				}
			}

			// If no chunks were created (no punctuation outside quotes), use the whole line
			if (chineseChunks.length === 0) {
				chineseChunks = [chineseLine];
			}

			// Process standalone quote marks - make sure each quote is in its own chunk
			const processedChunks = [];
			for (const chunk of chineseChunks) {
				// If this chunk contains standalone quote marks, split it
				if (
					(chunk.includes('"') ||
						chunk.includes('"') ||
						chunk.includes('「') ||
						chunk.includes('」')) &&
					chunk.length > 1
				) {
					// Split by opening quotes
					let parts = chunk.split(/(?<=[^"'"」「])(["'「])/g);

					// Then split by closing quotes
					parts = parts.flatMap((part) => part.split(/([""'」])(?=[^"'"」「]|$)/g));

					// Filter out empty parts and add to processed chunks
					parts
						.filter((part) => part.trim())
						.forEach((part) => {
							processedChunks.push(part);
						});
				} else {
					processedChunks.push(chunk);
				}
			}

			chineseChunks = processedChunks.filter((c) => c.trim());

			// For very short lines or lines without enough chunks, just use the whole line
			if (chineseChunks.length <= 1 || chineseLine.length < 10) {
				alignedChunks.push({
					text: chineseLine,
					pinyin: pinyinLine
				});
				continue;
			}

			// Now we need to map each Chinese chunk to its pinyin

			// First, find pinyin boundaries that correspond to punctuation
			// In pinyin, punctuation is typically followed by a space
			const pinyinWords = pinyinLine.split(' ');

			// Key insight: Chinese punctuation in the text corresponds to word boundaries in pinyin
			// We can use the punctuation positions to estimate pinyin positions

			// Count characters up to each punctuation mark
			let charCount = 0;
			const punctuationPositions = [];

			for (let j = 0; j < chineseChunks.length - 1; j++) {
				charCount += chineseChunks[j].length;
				punctuationPositions.push({
					chinesePos: charCount,
					chunk: chineseChunks[j]
				});
			}

			// Now map these positions to pinyin words
			let pinyinIndex = 0;
			let currentChinesePos = 0;
			let lastPinyinEndPos = 0;

			for (let j = 0; j < chineseChunks.length; j++) {
				const chunk = chineseChunks[j];
				const nextPunctPos = punctuationPositions[j]?.chinesePos || chineseLine.length;

				// Calculate the approximate fraction of the line this chunk represents
				const chunkFraction = (nextPunctPos - currentChinesePos) / chineseLine.length;

				// Estimate how many pinyin words this should cover
				const estPinyinWordCount = Math.max(1, Math.round(chunkFraction * pinyinWords.length));

				// But never go beyond the end of our pinyin
				const actualWordCount = Math.min(estPinyinWordCount, pinyinWords.length - pinyinIndex);

				// Handle special cases for dialogue markers and quotes
				let wordCount = actualWordCount;

				// If a chunk starts with a quote, it likely corresponds to the next word in pinyin
				if (chunk.startsWith('"') || chunk.startsWith('"') || chunk.startsWith('「')) {
					// Keep the word count small for opening quotes
					wordCount = Math.min(1, actualWordCount);
				}

				// If a chunk ends with a quote, it likely corresponds to the current word in pinyin
				if (chunk.endsWith('"') || chunk.endsWith('"') || chunk.endsWith('」')) {
					// Keep the word count small for closing quotes
					wordCount = Math.min(1, actualWordCount);
				}

				// Select the pinyin words for this chunk
				const pinyinChunk = pinyinWords.slice(pinyinIndex, pinyinIndex + wordCount).join(' ');

				// Special case: if this is "Wo" or "Ta" alone and it appears at the end of a previous chunk
				// or beginning of the next chunk, we should adjust
				if (j > 0 && pinyinChunk.match(/^(Wǒ|Tā)\b/i)) {
					// This is likely a subject pronoun that should be with the next chunk
					// Let's check if the previous chunk already has this word
					const prevPinyin = alignedChunks[alignedChunks.length - 1].pinyin;

					if (prevPinyin.match(/(Wǒ|Tā)\b/i)) {
						// Previous chunk already has this pronoun, don't include it again
						alignedChunks.push({
							text: chunk,
							pinyin: pinyinChunk.replace(/^(Wǒ|Tā)\b\s*/i, '')
						});
					} else {
						alignedChunks.push({
							text: chunk,
							pinyin: pinyinChunk
						});
					}
				} else {
					alignedChunks.push({
						text: chunk,
						pinyin: pinyinChunk
					});
				}

				pinyinIndex += wordCount;
				currentChinesePos = nextPunctPos;
			}
		}

		// Handle any remaining Chinese lines
		for (let i = maxLines; i < chineseLines.length; i++) {
			const line = chineseLines[i].trim();
			if (line.length > 0) {
				alignedChunks.push({
					text: line,
					pinyin: ''
				});
			}
		}

		return alignedChunks;
	}

	$: alignedChunks = alignChunks(text, pinyin);
</script>

<div class="chunk-container vintage-text">
	{#each alignedChunks as chunk}
		<div class="chunk">
			<div class="pinyin-text">{chunk.pinyin}</div>
			<!-- Apply the customClass here to the Chinese text -->
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
		/* Light border for visual separation */
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

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.chunk-container {
			gap: 0.25rem;
		}

		.chunk {
			margin-bottom: 0.25rem;
		}

		.pinyin-text {
			font-size: 0.75rem;
			line-height: 1.3;
		}

		.chinese-text {
			font-size: 1rem;
			line-height: 1.5;
		}
	}
</style>
