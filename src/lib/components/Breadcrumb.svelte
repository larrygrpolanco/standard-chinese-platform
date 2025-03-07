<!-- src/lib/components/Breadcrumb.svelte -->
<script>
	import { page } from '$app/stores';
	
	export let moduleName = '';
	export let moduleId = '';
	export let unitName = '';
	
	// Determine if we should show the breadcrumb at all
	$: showBreadcrumb = $page.url.pathname !== '/';
</script>

{#if showBreadcrumb}
	<nav class="mb-6">
		<ol class="flex flex-wrap items-center text-sm">
			<li class="flex items-center">
				<a 
					href="/" 
					class="text-[#34667F] transition-colors hover:text-[#C17C74] hover:underline"
				>
					Home
				</a>
				<svg
					class="mx-2 h-4 w-4 text-[#A0998A]"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path d="M9 5l7 7-7 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
			</li>

			{#if $page.url.pathname.startsWith('/modules')}
				<li class="flex items-center">
					{#if moduleId}
						<a
							href="/modules"
							class="text-[#34667F] transition-colors hover:text-[#C17C74] hover:underline"
						>
							Modules
						</a>
						<svg
							class="mx-2 h-4 w-4 text-[#A0998A]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M9 5l7 7-7 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{:else}
						<span class="font-medium text-[#33312E]">Modules</span>
					{/if}
				</li>
			{/if}

			{#if moduleName && moduleId}
				<li class="flex items-center">
					{#if unitName}
						<a
							href="/modules/{moduleId}"
							class="text-[#34667F] transition-colors hover:text-[#C17C74] hover:underline max-w-[200px] truncate"
						>
							{moduleName}
						</a>
						<svg
							class="mx-2 h-4 w-4 text-[#A0998A]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M9 5l7 7-7 7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					{:else}
						<span class="font-medium text-[#33312E] max-w-[200px] truncate">{moduleName}</span>
					{/if}
				</li>
			{/if}

			{#if unitName}
				<li class="font-medium text-[#33312E] max-w-[200px] truncate">{unitName}</li>
			{/if}
		</ol>
	</nav>
{/if}