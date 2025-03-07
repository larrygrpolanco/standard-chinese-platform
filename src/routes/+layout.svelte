<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="flex min-h-screen flex-col bg-gray-50">
	<Header />

	<main class="container mx-auto flex-grow px-4 py-8">
		<slot />
	</main>

	<footer class="mt-auto border-t border-gray-200 bg-white py-6">
		<div class="container mx-auto px-4 text-center text-sm text-gray-600">
			<p>© {new Date().getFullYear()} FSI Chinese Learning Platform</p>
			<p class="mt-1">Based on materials from the Foreign Service Institute</p>
		</div>
	</footer>
</div>
