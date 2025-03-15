<!-- ModuleCard.svelte -->
<script>
	import { fade } from 'svelte/transition';

	// Props
	export let authStore;
	export let latestUnit = null;
	export let completedCount = 0; // Just pass the count of completed units

	// Navigation functions
	function navigateToModules() {
		window.location.href = '/modules';
	}

	function navigateToLatestUnit() {
		if ($authStore && latestUnit) {
			window.location.href = `/units/${latestUnit.unit_id}`;
		} else {
			navigateToModules();
		}
	}

	// Keyboard navigation handler
	function handleKeydown(event) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			navigateToModules();
		}
	}

	// Get progress level based on completed count
	function getProgressWidth() {
		if (!$authStore || completedCount === 0) return 0;
		if (completedCount < 10) return 15;
		if (completedCount < 20) return 30;
		if (completedCount < 30) return 45;
		if (completedCount < 40) return 60;
		if (completedCount < 50) return 75;
		if (completedCount < 63) return 90;
		return 100;
	}

	// Get a descriptive progress status text
	function getProgressStatusText() {
		if (!$authStore || completedCount === 0) return 'SIDE A - NOT STARTED';
		if (completedCount < 15) return 'SIDE A - JUST STARTED';
		if (completedCount < 30) return 'SIDE A - MAKING PROGRESS';
		if (completedCount < 45) return 'SIDE B - OVER HALFWAY';
		if (completedCount < 63) return 'SIDE B - ALMOST DONE';
		return 'SIDE B - COMPLETE';
	}
</script>

<!-- Core Module -->
<div class="relative mx-auto mb-8 w-full max-w-3xl" in:fade={{ duration: 400, delay: 400 }}>
	<!-- Module card styled as vintage cassette case -->
	<div
		class="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B]"
		style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 2px 2px 0 #826D5B;"
		role="button"
		tabindex="0"
		aria-label="Browse modules"
		on:click={() => navigateToModules()}
		on:keydown={handleKeydown}
	>
		<!-- Top colored binding - using a green color -->
		<div class="h-3 w-full border-b-2 border-[#33312E] bg-[#DDB967]"></div>

		<!-- Card content -->
		<div class="flex flex-grow flex-col">
			<!-- Header section with title -->
			<div class="p-6">
				<div class="relative mb-3 flex gap-4">
					<!-- Title -->
					<h2
						class="flex-1 self-center font-['Arvo',serif] text-xl font-semibold text-[#33312E] transition-colors group-hover:text-[#C17C74]"
					>
						Core Modules
					</h2>

					<!-- Small tape icon - positioned relative to the top-right -->
					<div class="absolute top-0 right-0 opacity-70" aria-hidden="true">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect x="2" y="4" width="20" height="16" rx="2" stroke="#33312E" stroke-width="2" />
							<circle cx="7" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
							<circle cx="17" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
							<line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#33312E" stroke-width="1.5" />
						</svg>
					</div>
				</div>

				<!-- Progress meter styled as tape counter -->
				<div class="mt-4">
					<div class="flex items-center">
						<div class="mr-2 font-['Courier_New',monospace] text-xs tracking-tight opacity-80">
							PROGRESS:
						</div>
						<div
							class="relative h-4 flex-grow overflow-hidden rounded-sm border border-[#33312E] bg-[#F4F1DE]"
							style="box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);"
						>
							<!-- Progress bar -->
							<div
								class="h-full"
								style="width: {getProgressWidth()}%; transition: width 0.3s ease-out; background-color: #C17C74; opacity: 0.8;"
								role="progressbar"
								aria-valuenow={getProgressWidth()}
								aria-valuemin="0"
								aria-valuemax="100"
							></div>
							<!-- Tick marks -->
							<div
								class="pointer-events-none absolute top-0 left-0 flex h-full w-[80%] justify-between px-1"
								aria-hidden="true"
							>
								<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
								<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
								<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
								<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
							</div>
						</div>
					</div>
					<p class="mt-1 font-['Courier_New',monospace] text-xs text-[#33312E] opacity-70">
						{#if $authStore}
							{getProgressStatusText()} - {completedCount}/63 UNITS
						{:else}
							SIDE A - NOT STARTED
						{/if}
					</p>
				</div>
			</div>

			<!-- Divider with perforated line -->
			<div class="flex items-center px-4" aria-hidden="true">
				<div class="flex-grow border-t border-dashed border-[#A0998A]"></div>
			</div>

			<!-- Module description -->
			<div class="bg-opacity-50 flex-grow bg-[#F4F1DE] p-4">
				<p class="font-['Work_Sans',sans-serif] text-sm leading-relaxed text-[#33312E]">
					The FSI Standard Chinese course is divided into 9 core comprehensive modules.
				</p>
			</div>

			<!-- Call to action styled as a mechanical button -->
			<div
				class="border-t-2 border-[#33312E] p-3 text-right"
				style="background: repeating-linear-gradient(45deg, #7D8C5C10, #7D8C5C10 10px, transparent 10px, transparent 20px);"
			>
				{#if $authStore && latestUnit}
					<button
						type="button"
						class="inline-flex items-center rounded-full border border-[#33312E] bg-[#F4F1DE] px-4 py-1.5 text-sm font-medium text-[#33312E] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[2px_2px_0_#826D5B] active:translate-y-0.5 active:shadow-none"
						style="box-shadow: 1px 1px 0 #826D5B; transition: all 0.15s ease-out;"
						on:click|stopPropagation={() => navigateToLatestUnit()}
					>
						Continue learning
						<svg
							class="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</button>
				{:else}
					<button
						type="button"
						class="inline-flex items-center rounded-full border border-[#33312E] bg-[#F4F1DE] px-4 py-1.5 text-sm font-medium text-[#33312E] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[2px_2px_0_#826D5B] active:translate-y-0.5 active:shadow-none"
						style="box-shadow: 1px 1px 0 #826D5B; transition: all 0.15s ease-out;"
						on:click|stopPropagation={() => navigateToModules()}
					>
						Browse modules
						<svg
							class="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>
</div>
