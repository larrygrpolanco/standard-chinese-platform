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
		console.log('Page navigation started', $navigating?.to?.url?.pathname);

		// Set a 15-second timeout to reset loading state if navigation gets stuck
		const navigationTimeout = setTimeout(() => {
			console.error('Navigation timeout - resetting state');
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
			console.log('Page navigation completed');
			window.__navigationInProgress = false;
		});
	}

	onMount(async () => {
		// Initialize auth store with timeout protection
		try {
			const authPromise = authStore.initialize();
			const timeoutPromise = new Promise((_, reject) =>
				setTimeout(() => reject(new Error('Auth initialization timed out')), 8000)
			);

			await Promise.race([authPromise, timeoutPromise]);
		} catch (error) {
			console.error('Auth initialization failed:', error);
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

<style>
	/* App Container */
	.app-container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: #f4f1de;
		font-family: 'Work Sans', sans-serif;
		color: #33312e;
	}

	.main-content {
		flex: 1 0 auto;
		padding-bottom: 0 !important; /* Force remove any padding */
		display: flex;
		flex-direction: column;
	}

	/* Footer Styles */
	.site-footer {
		flex-shrink: 0;
		padding: 0rem 0 1.5rem;
		border-top: 1px solid #a0998a;
		background-color: #e8e5d7;
		position: relative;
		overflow: hidden;
	}

	.footer-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	/* Keeping your scan line effect */
	.scan-line-container {
		position: relative;
		width: 100%;
		height: 2px;
		margin-bottom: 1.5rem;
	}

	.scan-line {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(to right, transparent, #33312e, transparent);
	}

	.scan-line-highlight {
		position: absolute;
		top: 1px;
		left: 10%;
		right: 10%;
		height: 1px;
		background: linear-gradient(to right, transparent, #ddb967, transparent);
		opacity: 0.4;
	}

	/* New grid layout */
	.footer-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	.footer-column {
		display: flex;
		flex-direction: column;
	}

	.footer-heading {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #33312e;
	}

	.subscription-heading {
		margin-top: 1.5rem;
	}

	.footer-nav {
		display: flex;
		flex-direction: column;
	}

	.footer-link {
		font-size: 0.875rem;
		color: #665e4d;
		text-decoration: none;
		margin-bottom: 0.5rem;
		transition: color 0.2s;
	}

	.footer-link:hover {
		color: #ddb967;
		text-decoration: underline;
	}

	/* Bottom section with copyright */
	.footer-bottom {
		padding-top: 1.5rem;
		border-top: 1px solid rgba(160, 153, 138, 0.3);
		text-align: center;
	}

	/* Your existing styles with minor adjustments */
	.cassette-illustration {
		margin: 0 0 1rem;
		opacity: 0.6;
	}

	.vintage-message {
		font-family: 'Courier New', monospace;
		font-size: 0.7rem;
		letter-spacing: 0.1em;
		color: #33312e;
		text-transform: uppercase;
		opacity: 0.7;
		margin: 0 0 1rem;
	}

	.attribution {
		font-size: 0.8rem;
		color: #665e4d;
	}

	.copyright {
		font-size: 0.875rem;
		color: #33312e;
		margin-bottom: 0.5rem;
	}

	.footer-note {
		font-size: 0.75rem;
		color: #a0998a;
		max-width: 36rem;
		margin: 0 auto;
	}

	/* Cassette animations (keeping yours) */
	.reel {
		transform-origin: center;
	}

	.left-reel {
		animation: rotate 20s linear infinite;
	}

	.right-reel {
		animation: rotate 20s linear infinite reverse;
	}

	.scanner-line {
		animation: scan 4s ease-in-out infinite;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.footer-grid {
			grid-template-columns: 1fr 1fr;
		}

		.footer-column:first-child {
			grid-column: span 2;
			text-align: center;
			margin-bottom: 0.25rem;
		}

		.cassette-illustration {
			margin: 0 auto 1rem;
		}
	}

	@media (max-width: 480px) {
		.footer-grid {
			grid-template-columns: 1fr;
		}

		.footer-column:first-child {
			grid-column: span 1;
		}

		.footer-column {
			margin-bottom: 1.5rem;
		}
	}

	.copyright {
		font-size: 0.875rem;
		color: #33312e;
		margin-bottom: 0.5rem;
	}

	.attribution {
		font-size: 0.875rem;
		color: #33312e;
		margin-bottom: 0.75rem;
	}

	.footer-note {
		font-size: 0.75rem;
		color: #a0998a;
		max-width: 28rem;
		margin: 0 auto;
	}
</style>
