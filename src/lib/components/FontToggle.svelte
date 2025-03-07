<!-- FontToggle.svelte -->
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

<div class="vintage-control-panel border-warm-gray bg-beige mb-4 rounded-lg border p-3">
	<div class="flex flex-wrap items-center gap-4">
		<!-- Character toggle -->
		<div class="toggle-group flex items-center">
			<span class="text-charcoal mr-2 text-sm">Characters:</span>
			<div class="vintage-toggle-switch">
				<div class="toggle-track" on:click={toggleScript}>
					<div class="toggle-slider" class:right={$fontPreferences.script === 'traditional'}></div>
					<span
						class="toggle-option-left {$fontPreferences.script === 'simplified' ? 'active' : ''}"
						>简体字</span
					>
					<span
						class="toggle-option-right {$fontPreferences.script === 'traditional' ? 'active' : ''}"
						>繁體字</span
					>
				</div>
			</div>
		</div>

		<!-- Pinyin toggle -->
		<div class="toggle-group flex items-center">
			<span class="text-charcoal mr-2 text-sm">Pinyin:</span>
			<div class="vintage-toggle-switch">
				<div class="toggle-track" on:click={togglePinyin}>
					<div class="toggle-slider" class:right={$fontPreferences.showPinyin}></div>
					<span class="toggle-option-left {!$fontPreferences.showPinyin ? 'active' : ''}">Hide</span
					>
					<span class="toggle-option-right {$fontPreferences.showPinyin ? 'active' : ''}">Show</span
					>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.vintage-control-panel {
		background-color: var(--color-beige);
		background-image: url('/textures/subtle-paper.png');
		background-repeat: repeat;
	}

	.vintage-toggle-switch {
		position: relative;
		display: inline-block;
	}

	.toggle-track {
		position: relative;
		width: 120px;
		height: 28px;
		background-color: var(--color-cream-paper);
		border: 1px solid var(--color-warm-gray);
		border-radius: 14px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 4px;
		cursor: pointer;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.toggle-slider {
		position: absolute;
		left: 2px;
		top: 2px;
		width: calc(50% - 4px);
		height: calc(100% - 4px);
		background-color: var(--color-terracotta);
		border-radius: 12px;
		transition: transform 0.3s ease;
		z-index: 1;
	}

	.toggle-slider.right {
		transform: translateX(calc(100% + 4px));
	}

	.toggle-option-left,
	.toggle-option-right {
		font-family: 'Work Sans', sans-serif;
		font-size: 0.75rem;
		text-align: center;
		flex: 1;
		z-index: 2;
		transition: color 0.3s ease;
		color: var(--color-charcoal);
		user-select: none;
	}

	.toggle-option-left.active,
	.toggle-option-right.active {
		color: white;
	}
</style>
