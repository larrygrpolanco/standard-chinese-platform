<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	let { children } = $props();
</script>

<div class="app flex min-h-screen flex-col bg-gray-50">
	<Header />

	<main class="container mx-auto flex-grow px-4 py-8">
		{@render children()}
	</main>

	<footer class="bg-gray-800 p-4 text-white">
		<div class="container mx-auto text-center text-sm">
			<p>FSI Chinese Learning Platform - Based on Foreign Service Institute materials</p>
		</div>
	</footer>
</div>
