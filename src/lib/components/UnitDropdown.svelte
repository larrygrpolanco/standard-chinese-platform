<!-- UnitDropdown.svelte -->
<script>
	import { slide } from 'svelte/transition';
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

<div class="unit-dropdown relative">
	<button
		type="button"
		class="m-0 inline-flex cursor-pointer items-center border-none bg-transparent p-0"
		on:click={toggleDropdown}
		on:keydown={handleKeydown}
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		<h1 class="font-['Arvo',serif] text-2xl font-bold text-[#33312E] md:text-3xl">
			<span class="border-b border-[#C17C74] pb-0.5 transition-all duration-200 hover:border-b-2">
				{currentUnit.title}
			</span>
		</h1>
		<svg
			class="ml-2 h-4 w-4 text-[#A0998A] transition-all duration-200 hover:text-[#C17C74] {isOpen
				? 'rotate-180 text-[#C17C74]'
				: ''}"
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
			class="absolute left-0 z-10 mt-1 w-full max-w-[260px] border-r border-b border-l border-[#C17C74]/30 bg-[#F4F1DE]/95 shadow-[0_3px_6px_rgba(130,109,91,0.15)] backdrop-blur-sm"
			transition:slide={{ duration: 120, axis: 'y' }}
			role="listbox"
		>
			{#if loading}
				<div class="p-3 text-[#A0998A] italic">Loading units...</div>
			{:else if units.length === 0}
				<div class="p-3 text-[#A0998A] italic">No units found</div>
			{:else}
				<ul class="max-h-[60vh] overflow-y-auto py-1">
					{#each units as unit}
						<li role="option" aria-selected={unit.id.toString() === currentUnitId}>
							<a
								href="/units/{unit.id}"
								class="block border-l-2 px-4 py-2 font-['Arvo',serif] text-lg text-[#33312E] no-underline transition-all duration-150
                      {unit.id.toString() === currentUnitId
									? 'border-l-[#C17C74] bg-[#C17C74]/5 font-semibold text-[#C17C74]'
									: 'border-l-transparent hover:border-l-[#DDB967] hover:bg-[#DDB967]/5'}"
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
