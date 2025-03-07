<!-- src/lib/components/Breadcrumb.svelte -->
<script>
	import { page } from '$app/stores';

	export let moduleName = null;
	export let unitName = null;

	// Determine the current path and create breadcrumb items
	$: path = $page.url.pathname;
	$: items = [];

	$: {
		// Always start with Home
		items = [{ label: 'Home', href: '/' }];

		// If on modules page
		if (path.startsWith('/modules')) {
			items.push({ label: 'Modules', href: '/modules' });

			// If on a specific module page and we have a module name
			if (moduleName && path.match(/\/modules\/\d+/)) {
				items.push({ label: moduleName, href: path });
			}
		}

		// If on a unit page
		if (path.startsWith('/units/')) {
			items.push({ label: 'Modules', href: '/modules' });

			// If we have both module and unit names
			if (moduleName) {
				const moduleId = moduleName.match(/Module (\d+):/)?.[1];
				if (moduleId) {
					items.push({
						label: moduleName,
						href: `/modules/${moduleId}`
					});
				}
			}

			// Add the unit name if available
			if (unitName) {
				items.push({ label: unitName, href: path });
			}
		}
	}
</script>

<nav class="mb-6 flex text-sm">
	<ol class="inline-flex items-center space-x-1 md:space-x-3">
		{#each items as item, index}
			<li class="inline-flex items-center">
				{#if index > 0}
					<svg class="mx-1 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						></path>
					</svg>
				{/if}

				{#if index === items.length - 1}
					<!-- Last item (current page) -->
					<span class="font-medium text-gray-500">{item.label}</span>
				{:else}
					<!-- Navigation item -->
					<a href={item.href} class="text-[#1A5276] hover:text-[#154360] hover:underline">
						{item.label}
					</a>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
