<!-- src/lib/components/Breadcrumb.svelte -->
<script>
	import { page } from '$app/stores';

	// Dynamic breadcrumb path based on current page
	export let moduleName = null;
	export let unitName = null;

	// Set active path based on props and current URL
	$: pathItems = [
		{ label: 'Home', href: '/' },
		...(moduleName || $page.url.pathname.includes('/modules')
			? [{ label: 'Modules', href: '/modules' }]
			: []),
		...(moduleName
			? [
					{
						label: moduleName,
						href: $page.url.pathname.includes('/units') ? null : $page.url.pathname
					}
				]
			: []),
		...(unitName ? [{ label: unitName, href: null }] : [])
	];
</script>

<nav class="mb-6 text-sm" aria-label="Breadcrumb">
	<ol class="flex flex-wrap items-center space-x-1">
		{#each pathItems as item, index}
			<li class="flex items-center">
				{#if index > 0}
					<svg class="mx-1 h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
							clip-rule="evenodd"
						></path>
					</svg>
				{/if}

				{#if item.href}
					<a
						href={item.href}
						class="hover:text-[#1A5276] hover:underline"
						class:font-medium={index === 0}
					>
						{item.label}
					</a>
				{:else}
					<span class="max-w-[200px] truncate text-gray-500">{item.label}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
