<!-- src/lib/components/rwp/ListeningTab.svelte -->
<script>
	import StoryTape from '$lib/components/rwp/StoryTape.svelte';

	// Props
	export let content = {}; // The content JSON
</script>

<div class="listening-tab">
	{#if content.story && content.story.text}
		<!-- Audio player first -->
		<StoryTape
			storyText={content.story.text}
			storyTitle={content.meta?.title || 'Story'}
			language="zh"
		/>

		<!-- Note card moved below -->
		<div class="note-card">
			<div class="note-icon">
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
					><path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
					/></svg
				>
			</div>
			<div class="note-content">
				<p>
					This audio is created by AI, so the pronunciation might sound slightly different from
					native speakers.
				</p>
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<div class="tape-icon">
				<svg viewBox="0 0 24 24" class="cassette-icon">
					<rect
						x="2"
						y="6"
						width="20"
						height="12"
						rx="2"
						stroke="currentColor"
						fill="none"
						stroke-width="1.5"
					/>
					<circle cx="8" cy="12" r="2" stroke="currentColor" fill="none" stroke-width="1.5" />
					<circle cx="16" cy="12" r="2" stroke="currentColor" fill="none" stroke-width="1.5" />
					<line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="1.5" />
				</svg>
			</div>
			<h3 class="empty-title">No Story Content Available</h3>
			<p class="empty-message">This exercise doesn't have any story content available.</p>
		</div>
	{/if}
</div>

<style>
	.listening-tab {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		min-height: 300px;
	}

	.note-card {
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		background-color: var(--color-cream-paper, #f4f1de);
		border-left: 4px solid var(--color-gold, #ddb967);
		padding: 1rem;
		border-radius: 0 8px 8px 0;
	}

	.note-icon {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		color: var(--color-gold, #ddb967);
	}

	.note-content p {
		margin-bottom: 0.5rem;
		color: var(--color-charcoal, #33312e);
	}

	.note-content small {
		color: var(--color-warm-gray, #a0998a);
		font-style: italic;
	}

	.empty-state {
		text-align: center;
		max-width: 450px;
		margin: 2rem auto;
		padding: 1.5rem;
		background-color: var(--color-beige, #e8e5d7);
		border-radius: 8px;
		border: 1px dashed var(--color-warm-gray, #a0998a);
	}

	.tape-icon {
		margin: 0 auto 1rem;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background-color: var(--color-cream-paper, #f4f1de);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--color-warm-gray, #a0998a);
	}

	.cassette-icon {
		width: 32px;
		height: 32px;
		color: var(--color-terracotta, #c17c74);
	}

	.empty-title {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		color: var(--color-charcoal, #33312e);
		margin-bottom: 0.75rem;
	}

	.empty-message {
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>
