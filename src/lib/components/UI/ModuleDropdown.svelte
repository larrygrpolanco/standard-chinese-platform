<script>
	export let isOpen = false;
	export let coreModules = [];
	export let isActive = false;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function handleClick(e) {
		e.stopPropagation();
		dispatch('click', e);
	}
</script>

<div class="module-dropdown">
	<!-- Dropdown trigger -->
	<button
		on:click={handleClick}
		class="module-dropdown-trigger {isOpen || isActive ? 'active' : ''}"
		aria-expanded={isOpen}
	>
		<span>Modules</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
			class="dropdown-arrow {isOpen ? 'open' : ''}"
		>
			<path
				fill-rule="evenodd"
				d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
				clip-rule="evenodd"
			/>
		</svg>

		{#if isOpen || isActive}
			<div class="active-indicator"></div>
		{/if}
	</button>

	<!-- Dropdown content -->
	{#if isOpen}
		<div class="dropdown-content">
			<div class="dropdown-header">
				<a href="/modules" class="dropdown-header-text">Core Modules</a>
			</div>

			<div class="dropdown-body">
				{#each coreModules as module}
					<a href="/modules/{module.id}" data-sveltekit-reload class="module-item">
						<div class="module-number">
							{module.id}
						</div>
						<div>
							<div class="module-title">{module.title}</div>
							<div class="module-subtitle">{module.fullTitle}</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.module-dropdown {
		position: relative;
	}

	.module-dropdown-trigger {
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.25rem;
		border-radius: 0.375rem;
		padding: 0.5rem 0.75rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
		transition:
			color 0.15s,
			background-color 0.15s,
			border-color 0.15s;
	}

	.module-dropdown-trigger:hover {
		background-color: #e8e5d7;
	}

	.module-dropdown-trigger.active {
		background-color: rgba(221, 185, 103, 0.2);
		font-weight: 600;
	}

	.dropdown-arrow {
		margin-left: 0.25rem;
		height: 1rem;
		width: 1rem;
		transition: transform 0.2s;
	}

	.dropdown-arrow.open {
		transform: rotate(180deg);
	}

	.active-indicator {
		position: absolute;
		right: 0.75rem;
		bottom: 0;
		left: 0.75rem;
		height: 0.125rem;
		border-radius: 9999px;
		background-color: #ddb967;
	}

	.dropdown-content {
		position: absolute;
		z-index: 50;
		margin-top: 0.25rem;
		width: 16rem;
		transform-origin: top right;
		border-radius: 0.375rem;
		border: 1px solid #a0998a;
		background-color: #f4f1de;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.dropdown-header {
		border-bottom: 1px solid #a0998a;
		background-color: #e8e5d7;
		padding: 0.5rem 1rem;
	}

	.dropdown-header-text {
		font-size: 0.875rem;
		font-weight: 600;
		color: #34667f;
		text-decoration: none;
	}

	.dropdown-body {
		max-height: calc(100vh - 200px);
		overflow-y: auto;
		padding: 0.5rem;
		box-shadow: inset 0 2px 4px rgba(51, 49, 46, 0.05);
	}

	.module-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		border-radius: 0.375rem;
		padding: 0.5rem 0.75rem;
		transition: background-color 0.15s;
		text-decoration: none;
	}

	.module-item:hover {
		background-color: #e8e5d7;
	}

	.module-number {
		display: flex;
		height: 1.75rem;
		width: 1.75rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border-radius: 0.125rem;
		border: 1px solid #a0998a;
		background-color: #f4f1de;
		font-size: 0.75rem;
		font-weight: 700;
		box-shadow: inset 0 1px 2px rgba(51, 49, 46, 0.1);
	}

	.module-item:hover .module-number {
		border-color: #c17c74;
		color: #c17c74;
	}

	.module-title {
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
	}

	.module-subtitle {
		font-size: 0.75rem;
		color: #a0998a;
	}
</style>
