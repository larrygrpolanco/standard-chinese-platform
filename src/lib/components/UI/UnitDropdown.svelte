<!-- components/UI/UnitDropdown.svelte -->
<script>
	import { fade, fly } from 'svelte/transition';
	import { getUnitsByModuleId } from '$lib/supabase/client';

	export let currentUnit;
	export let currentUnitId;

	let units = [];
	let isOpen = false;
	let loading = true;

	async function loadUnits() {
		if (!currentUnit?.module?.id) return;

		try {
			units = await getUnitsByModuleId(currentUnit.module.id);
		} catch (err) {
			console.error('Error loading units for dropdown:', err);
		} finally {
			loading = false;
		}
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event) {
		if (isOpen && !event.target.closest('.unit-dropdown')) {
			isOpen = false;
		}
	}

	function handleKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			toggleDropdown();
			event.preventDefault();
		} else if (event.key === 'Escape' && isOpen) {
			isOpen = false;
		}
	}

	$: if (currentUnit?.module?.id) {
		loadUnits();
	}

	import { onMount, onDestroy } from 'svelte';

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="unit-dropdown">
	<button
		type="button"
		class="dropdown-button"
		on:click={toggleDropdown}
		on:keydown={handleKeydown}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<h1 class="unit-title">
			<span class="title-text">{currentUnit.title}</span>
		</h1>
		<svg
			class="dropdown-icon {isOpen ? 'open' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
			></path>
		</svg>
	</button>

	{#if isOpen}
		<div
			class="dropdown-menu"
			in:fly={{ y: -10, duration: 120 }}
			out:fade={{ duration: 80 }}
			role="listbox"
		>
			{#if loading}
				<div class="loading-text">Loading units...</div>
			{:else if units.length === 0}
				<div class="empty-text">No units found</div>
			{:else}
				<ul class="dropdown-list">
					{#each units as unit}
						<li role="option" aria-selected={unit.id.toString() === currentUnitId}>
							<a
								href="/units/{unit.id}"
								class="dropdown-item {unit.id.toString() === currentUnitId ? 'active' : ''}"
							>
								{unit.title}
							</a>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{/if}
</div>

<style>
	.unit-dropdown {
		position: relative;
	}

	.dropdown-button {
		margin: 0;
		display: inline-flex;
		align-items: center;
		background-color: transparent;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.unit-title {
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		font-weight: bold;
		color: #33312e;
		margin: 0;
	}

	@media (min-width: 768px) {
		.unit-title {
			font-size: 1.875rem;
		}
	}

	.title-text {
		border-bottom: 1px solid #c17c74;
		padding-bottom: 0.125rem;
		transition: all 0.2s;
	}

	.title-text:hover {
		border-bottom-width: 2px;
	}

	.dropdown-icon {
		margin-left: 0.5rem;
		height: 1rem;
		width: 1rem;
		color: #a0998a;
		transition: all 0.2s;
	}

	.dropdown-icon:hover {
		color: #c17c74;
	}

	.dropdown-icon.open {
		transform: rotate(180deg);
		color: #c17c74;
	}

	.dropdown-menu {
		position: absolute;
		top: 100%;
		left: 0;
		width: 100%;
		max-width: 260px;
		margin-top: 0.25rem;
		border-right: 1px solid rgba(193, 124, 116, 0.3);
		border-bottom: 1px solid rgba(193, 124, 116, 0.3);
		border-left: 1px solid rgba(193, 124, 116, 0.3);
		background-color: rgba(244, 241, 222, 0.95);
		box-shadow: 0 3px 6px rgba(130, 109, 91, 0.15);
		backdrop-filter: blur(4px);
		z-index: 20;
	}

	.dropdown-list {
		max-height: 60vh;
		overflow-y: auto;
		padding: 0.25rem 0;
		margin: 0;
		list-style-type: none;
	}

	.dropdown-item {
		display: block;
		padding: 0.5rem 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.125rem;
		color: #33312e;
		text-decoration: none;
		border-left: 2px solid transparent;
		transition: all 0.15s;
	}

	.dropdown-item:hover {
		border-left-color: #ddb967;
		background-color: rgba(221, 185, 103, 0.05);
	}

	.dropdown-item.active {
		border-left-color: #c17c74;
		background-color: rgba(193, 124, 116, 0.05);
		font-weight: 600;
		color: #c17c74;
	}

	.loading-text,
	.empty-text {
		padding: 0.75rem;
		color: #a0998a;
		font-style: italic;
	}
</style>
