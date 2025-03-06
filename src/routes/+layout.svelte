<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<div class="app flex min-h-screen flex-col bg-white text-gray-900">
	<Header />

	<main class="container mx-auto flex-grow px-4 py-10">
		{@render children()}
	</main>

	<footer class="bg-gray-100 py-6 text-gray-600 border-t border-gray-200">
		<div class="container mx-auto text-center text-sm">
			<p>© FSI Chinese Learning Platform</p>
			<p class="mt-1">Based on materials from the Foreign Service Institute</p>
		</div>
	</footer>
</div>