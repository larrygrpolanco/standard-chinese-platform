<!-- src/lib/components/Breadcrumb.svelte -->
<script>
	export let moduleName = '';
	export let moduleId = '';
	export let unitName = '';
</script>

<nav class="mb-6">
	<ol class="flex flex-wrap text-sm text-gray-500">
		<li class="flex items-center">
			<a href="/" class="hover:text-[#1A5276] hover:underline">Home</a>
			<svg class="mx-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</li>

		<li class="flex items-center">
			<a href="/modules" class="hover:text-[#1A5276] hover:underline">Modules</a>
			<svg class="mx-2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</li>

		{#if moduleName && moduleId}
			<li class="flex items-center">
				<a href="/modules/{moduleId}" class="hover:text-[#1A5276] hover:underline">
					{moduleName}
				</a>
				{#if unitName}
					<svg
						class="mx-2 h-5 w-5 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				{/if}
			</li>
		{/if}

		{#if unitName}
			<li class="font-medium text-gray-700">{unitName}</li>
		{/if}
	</ol>
</nav>
