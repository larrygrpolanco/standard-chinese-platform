<!-- src/lib/components/Header.svelte -->
<script>
	// Simple navigation header component
</script>

<header class="bg-blue-800 p-4 text-white">
	<div class="container mx-auto flex items-center justify-between">
		<a href="/" class="text-xl font-bold">FSI Chinese</a>

		<nav>
			<ul class="flex space-x-6">
				<li><a href="/" class="hover:text-blue-200">Home</a></li>
				<li><a href="/modules" class="hover:text-blue-200">Modules</a></li>
			</ul>
		</nav>
	</div>
</header>
