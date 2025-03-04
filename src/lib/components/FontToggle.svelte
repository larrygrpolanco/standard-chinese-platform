<!-- src/lib/components/FontToggle.svelte -->
<script>
	import { fontPreferences } from '$lib/stores/fontPreferences';

	function toggleScript() {
		fontPreferences.update((prefs) => ({
			...prefs,
			script: prefs.script === 'simplified' ? 'traditional' : 'simplified'
		}));
	}

	function togglePinyin() {
		fontPreferences.update((prefs) => ({
			...prefs,
			showPinyin: !prefs.showPinyin
		}));
	}
</script>

<div class="font-controls mb-4 flex gap-4 rounded-lg bg-gray-100 p-3">
	<div>
		<span class="mr-2 text-sm text-gray-600">Characters:</span>
		<button
			class="rounded px-3 py-1 {$fontPreferences.script === 'simplified'
				? 'bg-blue-600 text-white'
				: 'bg-gray-200'}"
			on:click={toggleScript}
		>
			简体字
		</button>
		<button
			class="rounded px-3 py-1 {$fontPreferences.script === 'traditional'
				? 'bg-blue-600 text-white'
				: 'bg-gray-200'}"
			on:click={toggleScript}
		>
			繁體字
		</button>
	</div>

	<div>
		<span class="mr-2 text-sm text-gray-600">Pinyin:</span>
		<button
			class="rounded px-3 py-1 {$fontPreferences.showPinyin
				? 'bg-blue-600 text-white'
				: 'bg-gray-200'}"
			on:click={togglePinyin}
		>
			{$fontPreferences.showPinyin ? 'Hide Pinyin' : 'Show Pinyin'}
		</button>
	</div>
</div>
