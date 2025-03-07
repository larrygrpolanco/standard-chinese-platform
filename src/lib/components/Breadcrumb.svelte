<!-- src/lib/components/Breadcrumb.svelte -->
<script>
	export let moduleName = '';
	export let moduleId = '';
	export let unitName = '';
</script>

<nav class="mb-4">
	<ol class="text-warm-gray flex flex-wrap text-sm">
		<li class="flex items-center">
			<a href="/" class="text-navy hover:text-terracotta transition-colors hover:underline">Home</a>
			<svg
				class="text-warm-gray mx-2 h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
			>
				<path d="M10 7l5 5-5 5" />
			</svg>
		</li>

		<li class="flex items-center">
			<a href="/modules" class="text-navy hover:text-terracotta transition-colors hover:underline"
				>Modules</a
			>
			<svg
				class="text-warm-gray mx-2 h-5 w-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
			>
				<path d="M10 7l5 5-5 5" />
			</svg>
		</li>

		{#if moduleName && moduleId}
			<li class="flex items-center">
				<a
					href="/modules/{moduleId}"
					class="text-navy hover:text-terracotta transition-colors hover:underline"
				>
					{moduleName}
				</a>
				{#if unitName}
					<svg
						class="text-warm-gray mx-2 h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
					>
						<path d="M10 7l5 5-5 5" />
					</svg>
				{/if}
			</li>
		{/if}

		{#if unitName}
			<li class="text-charcoal font-medium">{unitName}</li>
		{/if}
	</ol>
</nav>
