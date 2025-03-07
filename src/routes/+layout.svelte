<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="flex min-h-screen flex-col bg-[#F4F1DE] font-['Work_Sans',sans-serif] text-[#33312E]">
	<Header />

	<main class="container mx-auto max-w-[1200px] flex-grow px-4 py-8">
		<slot />
	</main>

	<footer class="mt-auto border-t border-[#A0998A] bg-[#E8E5D7] py-6">
		<div class="container mx-auto px-4 text-center text-sm text-[#A0998A]">
			<p>© {new Date().getFullYear()} FSI Chinese Learning Platform</p>
			<p class="mt-1">Based on materials from the Foreign Service Institute</p>
			<p class="mt-3 text-xs">
				Modernized and digitized by a language researcher and teacher to preserve this valuable
				resource
			</p>
		</div>
	</footer>
</div>
