<script>
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import Loader from '$lib/components/UI/Loader.svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	// Props
	export let storyText = ''; // Text to be converted to speech
	export let storyTitle = ''; // For reference
	export let language = 'zh'; // Default language (Chinese)

	// Cache settings
	const MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB max cache size
	const MAX_CACHE_ENTRIES = 10; // Max number of cached audios

	// OpenAI TTS voice options
	const voices = [
		{ id: 'alloy', name: 'Alloy' },
		{ id: 'echo', name: 'Echo' },
		{ id: 'fable', name: 'Fable' },
		{ id: 'onyx', name: 'Onyx' },
		{ id: 'nova', name: 'Nova' },
		{ id: 'shimmer', name: 'Shimmer' }
	];

	// State management
	let selectedVoice = voices[0].id;
	let audioUrl = null;
	let isLoading = false;
	let error = null;

	// Generate a unique cache key for this story/voice combination
	$: cacheKey = `tts_${storyTitle.substring(0, 20)}_${selectedVoice}`
		.replace(/\s+/g, '_')
		.toLowerCase();

	// Cache management functions
	function getSessionStorageSize() {
		let total = 0;
		for (let i = 0; i < sessionStorage.length; i++) {
			const key = sessionStorage.key(i);
			if (key.startsWith('tts_')) {
				total += sessionStorage.getItem(key).length;
			}
		}
		return total;
	}

	function pruneCache() {
		// If we have too many entries or we're over size limit, remove older entries
		if (sessionStorage.length > MAX_CACHE_ENTRIES || getSessionStorageSize() > MAX_CACHE_SIZE) {
			// Get all TTS cache keys and their timestamps
			const cacheEntries = [];
			for (let i = 0; i < sessionStorage.length; i++) {
				const key = sessionStorage.key(i);
				if (key.startsWith('tts_')) {
					try {
						const metadata = JSON.parse(sessionStorage.getItem(`${key}_meta`));
						cacheEntries.push({ key, timestamp: metadata.timestamp });
					} catch (e) {
						// If no metadata, just use current time (will prioritize removing this item)
						cacheEntries.push({ key, timestamp: 0 });
					}
				}
			}

			// Sort by timestamp (oldest first)
			cacheEntries.sort((a, b) => a.timestamp - b.timestamp);

			// Remove oldest entries until we're under our limits
			while (
				cacheEntries.length > 0 &&
				(cacheEntries.length > MAX_CACHE_ENTRIES - 1 ||
					getSessionStorageSize() > MAX_CACHE_SIZE * 0.8)
			) {
				const oldest = cacheEntries.shift();
				sessionStorage.removeItem(oldest.key);
				sessionStorage.removeItem(`${oldest.key}_meta`);
			}
		}
	}

	// Function to generate speech from text - manually triggered only
	async function generateSpeech() {
		if (!storyText) return;

		isLoading = true;
		error = null;

		try {
			// Check if we already have this audio cached in sessionStorage
			const cachedAudio = sessionStorage.getItem(cacheKey);
			if (cachedAudio) {
				audioUrl = cachedAudio;

				// Update the timestamp to mark it as recently used
				const metadata = { timestamp: Date.now() };
				sessionStorage.setItem(`${cacheKey}_meta`, JSON.stringify(metadata));

				isLoading = false;
				return;
			}

			// Call our API endpoint to generate the speech
			const response = await fetch('/api/tts', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					text: storyText,
					voice: selectedVoice,
					language: language
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				const errorMessage = errorData?.error || 'Failed to generate speech';
				throw new Error(errorMessage);
			}

			const data = await response.json();
			audioUrl = data.audioUrl;

			// Prune cache before adding new item
			pruneCache();

			// Cache the URL in sessionStorage with metadata
			sessionStorage.setItem(cacheKey, audioUrl);
			const metadata = { timestamp: Date.now(), size: audioUrl.length };
			sessionStorage.setItem(`${cacheKey}_meta`, JSON.stringify(metadata));
		} catch (err) {
			console.error('TTS Error:', err);
			error = err.message || 'Failed to generate speech';
		} finally {
			isLoading = false;
		}
	}

	// Clear cache for this audio
	function clearCache() {
		sessionStorage.removeItem(cacheKey);
		sessionStorage.removeItem(`${cacheKey}_meta`);
		audioUrl = null;
		error = null;
	}

	// Update audio when voice changes
	function handleVoiceChange() {
		// When changing voice, check if we have cached audio for this voice
		const cachedAudio = sessionStorage.getItem(cacheKey);
		if (cachedAudio) {
			audioUrl = cachedAudio;
		} else {
			// Reset audio URL if no cache exists for this voice
			audioUrl = null;
		}
	}

	// On mount, check if this audio is already cached
	onMount(() => {
		const cachedAudio = sessionStorage.getItem(cacheKey);
		if (cachedAudio) {
			audioUrl = cachedAudio;

			// Update the timestamp to mark it as recently used
			const metadata = { timestamp: Date.now() };
			sessionStorage.setItem(`${cacheKey}_meta`, JSON.stringify(metadata));
		}
	});
</script>

<section class="section-container">
	<!-- Audio Player Container -->
	<div class="audio-player-wrapper bg-beige border-warm-gray rounded-lg border">
		<div class="audio-player-grid-container p-4">
			{#if isLoading}
				<div class="loading-state">
					<Loader />
					<p class="text-sm">Creating audio...</p>
				</div>
			{:else if error}
				<div class="error-message">
					<p>Sorry, there was a problem. Please try again.</p>
					<button class="retry-button mt-3" on:click={generateSpeech}>Try Again</button>
				</div>
			{:else if audioUrl}
				<div class="audio-player-container">
					<!-- Small voice selector in top right corner -->
					<div class="voice-select-container mb-3 text-right">
						<label for="voice-select" class="text-warm-gray text-xs">Voice:</label>
						<select
							id="voice-select"
							class="voice-select border-warm-gray bg-cream-paper ml-2 rounded border p-1 text-xs"
							bind:value={selectedVoice}
							on:change={handleVoiceChange}
						>
							{#each voices as voice}
								<option value={voice.id}>{voice.name}</option>
							{/each}
						</select>
					</div>

					<AudioPlayer audioSrc={audioUrl} />

					<div class="mt-2 flex justify-center">
						<button class="text-warm-gray hover:text-terracotta text-xs" on:click={clearCache}>
							Regenerate Audio
						</button>
					</div>
				</div>
			{:else}
				<div class="audio-placeholder-container">
					<p class="mb-3 text-sm">Hear this story read aloud in Chinese</p>

					<button class="generate-button" on:click={generateSpeech}>
						<svg
							class="mr-2 h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
						>
							<path d="M15.5 8.5a7 7 0 110 7m-9-7v7m0 0l3-3m-3 3l-3-3"></path>
						</svg>
						Create Audio
					</button>

					<!-- Voice selector below button when no audio yet -->
					<div class="voice-select-container mt-3">
						<label for="voice-select-initial" class="text-warm-gray text-xs">Voice:</label>
						<select
							id="voice-select-initial"
							class="voice-select border-warm-gray bg-cream-paper ml-2 rounded border p-1 text-xs"
							bind:value={selectedVoice}
						>
							{#each voices as voice}
								<option value={voice.id}>{voice.name}</option>
							{/each}
						</select>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.audio-player-wrapper {
		position: relative;
		min-height: 180px;
		overflow: hidden;
	}

	.audio-player-grid-container {
		background-color: var(--color-cream-paper, #f5f2e8);
		/* Vintage paper texture */
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
	}

	.voice-select-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.voice-select {
		border-color: var(--color-warm-gray);
	}

	.loading-state,
	.error-message,
	.audio-placeholder-container {
		padding: 16px;
		text-align: center;
		background-color: var(--color-cream-paper);
		border: 1px dashed var(--color-warm-gray);
		border-radius: 8px;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.error-message {
		color: var(--color-terracotta);
	}

	.retry-button {
		background-color: var(--color-gold);
		padding: 8px 16px;
		border-radius: 4px;
		font-weight: 600;
		transition: all 0.2s;
	}

	.retry-button:hover {
		background-color: var(--color-gold-dark, #c4a255);
	}

	.audio-placeholder-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.generate-button {
		display: flex;
		align-items: center;
		padding: 10px 16px;
		background-color: var(--color-gold);
		color: var(--color-charcoal);
		border-radius: 6px;
		font-weight: 600;
		transition: all 0.2s;
	}

	.generate-button:hover {
		background-color: var(--color-gold-dark, #c4a255);
		transform: translateY(-2px);
	}

	.audio-player-container {
		display: flex;
		flex-direction: column;
	}
</style>
