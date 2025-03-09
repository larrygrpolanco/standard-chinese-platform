<script>
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
</script>

<style>
    /* Custom CSS for proper footer centering */
    .footer-content {
        text-align: center;
    }
    
    .cassette-container {
        max-width: 28rem; /* Equivalent to max-w-md */
        margin-left: auto;
        margin-right: auto;
    }
    
    .svg-container {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    
    .footer-text {
        text-align: center;
        margin-left: auto;
        margin-right: auto;
    }
</style>

<div class="flex min-h-screen flex-col bg-[#F4F1DE] font-['Work_Sans',sans-serif] text-[#33312E]">
	<Header />

	<main class="flex-grow">
		<slot />
	</main>

	<footer class="border-t border-[#A0998A] bg-[#E8E5D7] pb-8">
		<div class="mx-auto px-4">
			<div class="footer-content">
				<!-- Main footer content -->
				<div class="cassette-container mb-8">
					<!-- Top line with retro-tech styling -->
					<div class="relative">
						<div class="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#33312E] to-transparent"></div>
						<div class="absolute left-[10%] right-[10%] top-1 h-px bg-gradient-to-r from-transparent via-[#DDB967] to-transparent opacity-40"></div>
					</div>
					
					<!-- Vintage style message -->
					<div class="my-5 font-['Courier_New',monospace] text-xs uppercase tracking-wider text-[#33312E] opacity-70">
						ORIGINALLY RECORDED ON CASSETTE TAPES
					</div>
					
					<!-- Cassette illustration with Robocop-inspired enhancements -->
					<div class="svg-container mt-4 opacity-60">
						<svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
							<!-- Cassette body with metallic effect -->
							<rect x="5" y="5" width="90" height="50" rx="4" stroke="#33312E" stroke-width="2" />
							
							<!-- Left reel -->
							<circle cx="30" cy="30" r="10" stroke="#33312E" stroke-width="2" />
							<circle cx="30" cy="30" r="3" stroke="#33312E" stroke-width="1" />
							
							<!-- Right reel -->
							<circle cx="70" cy="30" r="10" stroke="#33312E" stroke-width="2" />
							<circle cx="70" cy="30" r="3" stroke="#33312E" stroke-width="1" />
							
							<!-- Tape connection -->
							<line x1="40" y1="30" x2="60" y2="30" stroke="#33312E" stroke-width="2" />
							
							<!-- Label with subtle gradient -->
							<rect x="20" y="10" width="60" height="10" rx="2" stroke="#33312E" stroke-width="1.5" />
							
							<!-- Scanner line effect (Robocop-inspired) -->
							<rect x="10" y="29" width="80" height="2" fill="#DDB967" opacity="0.3" />
						</svg>
					</div>
				</div>
				
				<!-- Credits and modernization info -->
				<p class="footer-text text-sm text-[#33312E]">© {new Date().getFullYear()} Taped Chinese</p>
				<p class="footer-text mt-2 text-sm text-[#33312E]">Based on materials from the Foreign Service Institute</p>
				<p class="footer-text mt-3 max-w-md text-xs text-[#A0998A]">
					Modernized and digitized by a language researcher and teacher to preserve this valuable resource
				</p>
			</div>
		</div>
	</footer>
</div>