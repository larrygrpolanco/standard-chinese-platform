<!-- src/lib/components/Header.svelte -->
<script>
	// Simple navigation header component
</script>

<header class="py-4 border-b border-gray-200">
	<div class="container mx-auto flex items-center justify-between px-4">
		<a href="/" class="text-xl font-semibold text-gray-900">FSI Chinese</a>

		<nav>
			<ul class="flex space-x-8">
				<li><a href="/" class="text-gray-700 hover:text-gray-900">Home</a></li>
				<li><a href="/modules" class="text-gray-700 hover:text-gray-900">Modules</a></li>
			</ul>
		</nav>
	</div>
</header>