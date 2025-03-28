<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import Header from '$lib/components/UI/Header.svelte';
	import Breadcrumb from '$lib/components/UI/Breadcrumb.svelte';
	import { navigating } from '$app/stores';
	import { tick } from 'svelte';

	let isLoading = false;
	
	// Track page navigation state with timeout
	$: if ($navigating) {
		isLoading = true;
		console.log("Page navigation started", $navigating?.to?.url?.pathname);
		
		// Set a 15-second timeout to reset loading state if navigation gets stuck
		const navigationTimeout = setTimeout(() => {
			console.error("Navigation timeout - resetting state");
			isLoading = false;
			window.__navigationInProgress = false;
		}, 15000);
		
		window.__navigationTimeoutId = navigationTimeout;
		window.__navigationInProgress = true;
	} else if (isLoading) {
		// Clear timeout when navigation completes normally
		if (window.__navigationTimeoutId) {
			clearTimeout(window.__navigationTimeoutId);
			window.__navigationTimeoutId = null;
		}
		
		tick().then(() => {
			isLoading = false;
			console.log("Page navigation completed");
			window.__navigationInProgress = false;
		});
	}

	onMount(async () => {
		// Initialize auth store with timeout protection
		try {
			const authPromise = authStore.initialize();
			const timeoutPromise = new Promise((_, reject) => 
				setTimeout(() => reject(new Error("Auth initialization timed out")), 8000)
			);
			
			await Promise.race([authPromise, timeoutPromise]);
		} catch (error) {
			console.error("Auth initialization failed:", error);
			// Continue without auth rather than getting stuck
		}
	});
</script>

<div class="app-container">
	<Header />
	<Breadcrumb />

	<main class="main-content">
		<slot />
	</main>

	<!-- Footer section remains unchanged -->
	<footer class="site-footer">
		<div class="footer-container">
			<!-- Top scanner line effect -->
			<div class="scan-line-container">
				<div class="scan-line"></div>
				<div class="scan-line-highlight"></div>
			</div>

			<div class="footer-grid">
				<!-- Left column: Cassette branding -->
				<div class="footer-column">
					<div class="cassette-illustration">
						<svg
							class="cassette-svg"
							width="130"
							height="80"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect x="3" y="6" width="18" height="12" rx="1" stroke="#33312E" stroke-width="2" />
							<circle
								cx="8"
								cy="12"
								r="2"
								stroke="#33312E"
								stroke-width="2"
								class="reel left-reel"
							/>
							<circle
								cx="16"
								cy="12"
								r="2"
								stroke="#33312E"
								stroke-width="2"
								class="reel right-reel"
							/>
							<line x1="10" y1="12" x2="14" y2="12" stroke="#33312E" stroke-width="2" />
						</svg>
					</div>
					<p class="vintage-message">ORIGINALLY RECORDED ON CASSETTE TAPES</p>
				</div>

				<!-- Middle column: Legal link -->
				<div class="footer-column">
					<h3 class="footer-heading">Information</h3>
					<nav class="footer-nav">
						<a href="/policies" class="footer-link">Privacy Policy</a>
                        <a href="/policies#terms" class="footer-link">Terms of Service</a>
					</nav>
				</div>

				<!-- Right column: Contact & Subscription links -->
				<div class="footer-column">
					<h3 class="footer-heading">Contact</h3>
					<a href="/policies#contact" class="footer-link">Contact Me</a>

					<h3 class="footer-heading subscription-heading">Subscription</h3>
					<a href="/policies#premium" class="footer-link">Subscription Features</a>
				</div>
			</div>

			<div class="footer-bottom">
				<p class="copyright">© {new Date().getFullYear()} Taped Chinese</p>
				<p class="footer-note">
					This resource is an independent, educational project not affiliated with the U.S.
					Government or Foreign Service Institute.
				</p>
			</div>
		</div>
	</footer>
</div>