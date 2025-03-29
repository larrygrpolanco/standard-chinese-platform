<!-- src/lib/components/rwp/StoryTape.svelte -->
<script>
	import { checkTTSAvailability, incrementTTSUsage } from '$lib/supabase/client';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import Loader from '$lib/components/UI/Loader.svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	// Props
	export let storyText = ''; // Text to be converted to speech
	export let storyTitle = ''; // For reference
	export let language = 'zh'; // Default language (Chinese)
	export let instructions = ''; // Optional instructions for speech style
	let isCacheLoading = false;
	let ttsStatus;

	// Cache settings
	const MAX_CACHE_SIZE = 5 * 1024 * 1024; // 5MB max cache size
	const MAX_CACHE_ENTRIES = 10; // Max number of cached audios

	// UPDATED: OpenAI TTS voice options for GPT-4o-mini-tts
	const voices = [
		{ id: 'alloy', name: 'Alloy' },
		{ id: 'ash', name: 'Ash' },
		{ id: 'ballad', name: 'Ballad' },
		{ id: 'coral', name: 'Coral' },
		{ id: 'echo', name: 'Echo' },
		{ id: 'fable', name: 'Fable' },
		{ id: 'onyx', name: 'Onyx' },
		{ id: 'nova', name: 'Nova' },
		{ id: 'sage', name: 'Sage' },
		{ id: 'shimmer', name: 'Shimmer' }
	];

	// State management
	let selectedVoice = voices[0].id;
	let audioUrl = null;
	let isLoading = false;
	let error = null;
	let showAdvancedOptions = false;
	let customInstructions = instructions || '';

	// Generate a unique cache key for this story/voice combination
	$: cacheKey =
		`tts_${storyTitle.substring(0, 20)}_${selectedVoice}_${customInstructions.substring(0, 20)}`
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
			// Check if the user is allowed to use TTS
			const availability = await checkTTSAvailability();
			if (!availability.allowed) {
				throw new Error(
					`${availability.reason}. ${
						availability.resetTime
							? `Available again: ${new Date(availability.resetTime).toLocaleString()}`
							: ''
					}`
				);
			}

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
					language: language,
					instructions: customInstructions
				})
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => null);
				const errorMessage = errorData?.error || 'Failed to generate speech';
				throw new Error(errorMessage);
			}

			const data = await response.json();
			audioUrl = data.audioUrl;

			// Increment usage counter after successful generation
			await incrementTTSUsage();

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
	onMount(async () => {
		// Set cache loading flag
		isCacheLoading = true;

		// Get TTS availability status on component mount
		ttsStatus = await checkTTSAvailability();

		const cachedAudio = sessionStorage.getItem(cacheKey);
		if (cachedAudio) {
			audioUrl = cachedAudio;

			// Update the timestamp to mark it as recently used
			const metadata = { timestamp: Date.now() };
			sessionStorage.setItem(`${cacheKey}_meta`, JSON.stringify(metadata));
		}
		// Clear loading flag
		isCacheLoading = false;
	});

	function goToProfile() {
		window.location.href = '/profile#subscription';
	}
</script>

<section class="section-container">
	<!-- Audio Player Container -->
	<div class="audio-player-wrapper">
		{#if ttsStatus && !ttsStatus.allowed}
			<!-- Overlay when TTS is unavailable -->
			<div class="audio-content disabled">
				<div class="disabled-overlay">
					{#if ttsStatus.reason === 'TTS requires premium subscription' || ttsStatus.reason === 'Not authenticated'}
						<div class="message-container">
							<h3 class="message-title">Listening Exercises</h3>
							<p class="message-text">
								{ttsStatus.reason === 'Not authenticated'
									? 'Please sign in to access audio recordings.'
									: 'Please subscribe to access RWP audio recordings.'}
							</p>
							{#if ttsStatus.reason === 'TTS requires premium subscription'}
								<p class="message-note">
									You'll always keep access to any practice exercises you've already generated.
								</p>
							{/if}
							<button
								class="subscribe-button"
								on:click={ttsStatus.reason === 'Not authenticated'
									? () => (window.location.href = '/login')
									: goToProfile}
							>
								{ttsStatus.reason === 'Not authenticated' ? 'Sign In' : 'Become a Supporter'}
							</button>
						</div>
					{:else}
						<div class="message-container">
							<h3 class="message-title">Daily Limit Reached</h3>
							<p class="message-text">
								You've used all your daily audio exercises for today. Don't worry, your limit will
								reset tomorrow.
							</p>
							<p class="message-note">
								We set these limits to allow fair usage for all supporters.
							</p>
						</div>
					{/if}
				</div>
			</div>
		{:else}
			<!-- Audio Player Container -->
			<div class="audio-player-grid-container">
				{#if isCacheLoading}
					<div class="loading-state">
						<Loader />
					</div>
				{:else if isLoading}
					<div class="loading-state">
						<Loader />
						<p>Creating audio...</p>
					</div>
				{:else if error}
					<div class="error-message">
						<p>Sorry, there was a problem. Please try again.</p>
						<button class="retry-button" on:click={generateSpeech}>Try Again</button>
					</div>
				{:else if audioUrl}
					<div class="audio-player-container">
						<AudioPlayer audioSrc={audioUrl} />

						<div class="regenerate-container">
							<button class="regenerate-button" on:click={clearCache}> Record New Tape </button>
						</div>
					</div>
				{:else}
					<div class="audio-placeholder-container">
						<p><em>Hear this story read aloud in Chinese</em></p>

						<div class="options-container">
							<!-- Voice selector - only visible before generating audio -->
							<div class="voice-select-container">
								<label for="voice-select-initial">Voice:</label>
								<select id="voice-select-initial" class="voice-select" bind:value={selectedVoice}>
									{#each voices as voice}
										<option value={voice.id}>{voice.name}</option>
									{/each}
								</select>
							</div>

							<!-- Advanced options toggle This does not work well add once OpenAI improves this  -->
							<!-- <div class="advanced-toggle">
								<button
									class="toggle-button"
									on:click={() => (showAdvancedOptions = !showAdvancedOptions)}
								>
									{showAdvancedOptions ? 'Hide' : 'Show'} advanced options
								</button>
							</div> -->

							<!-- Advanced options (instructions) -->
							{#if showAdvancedOptions}
								<div class="advanced-options">
									<label for="custom-instructions"> Speech instructions (optional): </label>
									<textarea
										id="custom-instructions"
										class="instructions-input"
										rows="2"
										placeholder="E.g., 'Speak slowly and clearly' or 'Use a cheerful tone'"
										bind:value={customInstructions}
									></textarea>
								</div>
							{/if}

							<button class="generate-button" on:click={generateSpeech}>
								<svg
									class="button-icon"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
								>
									<path d="M12 6v12M8 9v6M4 10v4M16 9v6M20 10v4" />
								</svg>
								Create Listening Tape
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</section>

<style>
	/* Container styling */
	.audio-player-wrapper {
		position: relative;
		min-height: 180px;
		overflow: hidden;
		border: 1px solid var(--color-warm-gray, #a0998a);
		border-radius: 0.5rem;
		background-color: var(--color-beige, #f4f1de);
	}

	.audio-player-grid-container {
		background-color: var(--color-cream-paper, #f5f2e8);
		padding: 1rem;
		/* Vintage paper texture */
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
	}

	/* Voice selection styling */
	.voice-select-container {
		display: flex;
		align-items: center;
		margin-bottom: 0.75rem;
		justify-content: center;
	}

	.voice-select {
		border: 1px solid var(--color-warm-gray, #a0998a);
		background-color: var(--color-cream-paper, #f5f2e8);
		border-radius: 0.25rem;
		padding: 0.25rem 0.5rem;
		margin-left: 0.5rem;
		font-size: 0.75rem;
	}

	/* States styling */
	.loading-state,
	.error-message,
	.audio-placeholder-container {
		padding: 1rem;
		text-align: center;
		background-color: var(--color-cream-paper, #f5f2e8);
		border: 1px dashed var(--color-warm-gray, #a0998a);
		border-radius: 0.5rem;
	}

	.loading-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.error-message {
		color: var(--color-terracotta, #d97706);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 0.5rem;
	}

	/* Buttons styling */
	.retry-button {
		background-color: var(--color-terracotta, #d97706);
		border-radius: 0.375rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: white;
		border: none;
		cursor: pointer;
		margin-top: 0.75rem;
		transition: background-color 0.2s ease;
	}

	.retry-button:hover {
		background-color: var(--color-terracotta-dark, #b45309);
	}

	.audio-placeholder-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.options-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
		max-width: 400px;
		align-items: center;
	}

	.generate-button {
		background-color: var(--color-terracotta, #d97706);
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		padding: 0.5rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: white;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.generate-button:hover {
		background-color: var(--color-terracotta-dark, #b45309);
	}

	.audio-player-container {
		display: flex;
		flex-direction: column;
	}

	.button-icon {
		width: 1.25rem;
		height: 1.25rem;
		margin-right: 0.5rem;
	}

	.regenerate-container {
		display: flex;
		justify-content: center;
		margin-top: 0.5rem;
	}

	.regenerate-button {
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		text-decoration: underline;
	}

	.regenerate-button:hover {
		color: var(--color-terracotta, #d97706);
	}

	.advanced-toggle {
		display: flex;
		align-items: center;
	}

	.toggle-button {
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.75rem;
		background: none;
		border: none;
		cursor: pointer;
		text-decoration: underline;
	}

	.advanced-options {
		margin-top: 0.5rem;
	}

	.advanced-options label {
		display: block;
		margin-bottom: 0.25rem;
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.75rem;
	}

	.instructions-input {
		width: 100%;
		border: 1px solid var(--color-warm-gray, #a0998a);
		background-color: var(--color-cream-paper, #f5f2e8);
		border-radius: 0.25rem;
		padding: 0.5rem;
		font-size: 0.75rem;
	}

	/* Fixed disabled state styling */
	.audio-content.disabled {
		position: relative;
		height: 100%;
		min-height: 180px;
		background-color: var(--color-cream-paper, #f5f2e8);
		padding: 1rem;
		/* Same texture as the audio player */
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
	}

	.disabled-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(244, 241, 222, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	}

	.message-container {
		max-width: 90%;
		text-align: center;
		padding: 1rem;
	}

	.message-title {
		font-size: 1.125rem;
		color: var(--color-charcoal, #33312e);
		margin-bottom: 0.5rem;
		font-weight: 600;
	}

	.message-text {
		color: var(--color-charcoal, #33312e);
		margin-bottom: 0.5rem;
		line-height: 1.4;
		font-size: 0.875rem;
	}

	.message-note {
		color: var(--color-warm-gray, #a0998a);
		font-size: 0.75rem;
		font-style: italic;
		margin-bottom: 0.75rem;
	}

	.subscribe-button {
		background-color: var(--color-terracotta, #d97706);
		color: white;
		border: none;
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.subscribe-button:hover {
		background-color: var(--color-terracotta-dark, #b45309);
		transform: translateY(-1px);
	}
</style>
