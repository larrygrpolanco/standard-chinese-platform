<!-- src/lib/components/AudioPlayer.svelte -->
<script>
	import { onMount, onDestroy } from 'svelte';

	export let src = '';
	export let title = '';

	let audio;
	let isPlaying = false;
	let duration = 0;
	let currentTime = 0;
	let playbackRate = 1;

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	}

	function togglePlay() {
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		isPlaying = !isPlaying;
	}

	function setPlaybackRate(rate) {
		playbackRate = rate;
		if (audio) audio.playbackRate = rate;
	}

	function handleTimeUpdate() {
		currentTime = audio.currentTime;
	}

	function handleSeek(e) {
		audio.currentTime = e.target.value;
	}

	onMount(() => {
		if (audio) {
			audio.addEventListener('timeupdate', handleTimeUpdate);
			audio.addEventListener('loadedmetadata', () => {
				duration = audio.duration;
			});
			audio.addEventListener('ended', () => {
				isPlaying = false;
			});
		}
	});

	onDestroy(() => {
		if (audio) {
			audio.removeEventListener('timeupdate', handleTimeUpdate);
		}
	});
</script>

<div class="audio-player rounded-lg bg-gray-100 p-4">
	<h3 class="mb-2 text-lg font-medium">{title}</h3>

	<audio bind:this={audio} {src} preload="metadata"></audio>

	<div class="controls mb-3 flex items-center space-x-2">
		<button
			on:click={togglePlay}
			class="play-button flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
		>
			{#if isPlaying}
				<svg class="h-4 w-4" viewBox="0 0 24 24"
					><path fill="currentColor" d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" /></svg
				>
			{:else}
				<svg class="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z" /></svg
				>
			{/if}
		</button>

		<div class="w-full">
			<input
				type="range"
				min="0"
				max={duration || 0}
				value={currentTime}
				on:input={handleSeek}
				class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-300"
			/>
			<div class="mt-1 flex justify-between text-xs text-gray-600">
				<span>{formatTime(currentTime)}</span>
				<span>{formatTime(duration)}</span>
			</div>
		</div>
	</div>

	<div class="playback-rate flex space-x-2">
		<button
			on:click={() => setPlaybackRate(0.75)}
			class="rounded px-2 py-1 text-xs {playbackRate === 0.75
				? 'bg-blue-600 text-white'
				: 'bg-gray-300'}"
		>
			0.75x
		</button>
		<button
			on:click={() => setPlaybackRate(1)}
			class="rounded px-2 py-1 text-xs {playbackRate === 1
				? 'bg-blue-600 text-white'
				: 'bg-gray-300'}"
		>
			1x
		</button>
		<button
			on:click={() => setPlaybackRate(1.25)}
			class="rounded px-2 py-1 text-xs {playbackRate === 1.25
				? 'bg-blue-600 text-white'
				: 'bg-gray-300'}"
		>
			1.25x
		</button>
		<button
			on:click={() => setPlaybackRate(1.5)}
			class="rounded px-2 py-1 text-xs {playbackRate === 1.5
				? 'bg-blue-600 text-white'
				: 'bg-gray-300'}"
		>
			1.5x
		</button>
	</div>
</div>
