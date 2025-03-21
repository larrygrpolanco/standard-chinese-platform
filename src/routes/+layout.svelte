<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import Header from '$lib/components/UI/Header.svelte';
	import Breadcrumb from '$lib/components/UI/Breadcrumb.svelte';

	onMount(() => {
		authStore.initialize();
	});
</script>

<div class="app-container">
	<Header />
	<Breadcrumb />

	<main class="main-content">
		<slot />
	</main>

	<footer class="site-footer">
		<div class="footer-container">
			<div class="footer-content">
				<!-- Top scan line effect -->
				<div class="scan-line-container">
					<div class="scan-line"></div>
					<div class="scan-line-highlight"></div>
				</div>

				<!-- Vintage style message -->
				<div class="vintage-message">ORIGINALLY RECORDED ON CASSETTE TAPES</div>

				<!-- Cassette illustration -->
				<div class="cassette-illustration">
					<svg
						width="100"
						height="60"
						viewBox="0 0 100 60"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="cassette-svg"
					>
						<!-- Cassette body -->
						<rect x="5" y="5" width="90" height="50" rx="4" stroke="#33312E" stroke-width="2" />

						<!-- Left reel -->
						<circle
							cx="30"
							cy="30"
							r="10"
							stroke="#33312E"
							stroke-width="2"
							class="reel left-reel"
						/>
						<circle cx="30" cy="30" r="3" stroke="#33312E" stroke-width="1" />

						<!-- Right reel -->
						<circle
							cx="70"
							cy="30"
							r="10"
							stroke="#33312E"
							stroke-width="2"
							class="reel right-reel"
						/>
						<circle cx="70" cy="30" r="3" stroke="#33312E" stroke-width="1" />

						<!-- Tape connection -->
						<line x1="40" y1="30" x2="60" y2="30" stroke="#33312E" stroke-width="2" />

						<!-- Label -->
						<rect x="20" y="10" width="60" height="10" rx="2" stroke="#33312E" stroke-width="1.5" />

						<!-- Scanner line effect -->
						<rect
							x="10"
							y="29"
							width="80"
							height="2"
							fill="#DDB967"
							opacity="0.3"
							class="scanner-line"
						/>
					</svg>
				</div>

				<!-- Footer text -->
				<p class="copyright">
					© {new Date().getFullYear()} Taped Chinese
				</p>
				<p class="attribution">Based on materials from the Foreign Service Institute</p>
				<p class="footer-note">
					Modernized and digitized to preserve and share this open source resource
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
	}

	/* Footer Styles */
	.site-footer {
		flex-shrink: 0;
		padding: 2rem 0;
		border-top: 1px solid #a0998a;
		background-color: #e8e5d7;
		position: relative;
		overflow: hidden;
	}

	.footer-container {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		position: relative;
	}

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
		height: 1px;
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

	.vintage-message {
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.1em;
		color: #33312e;
		text-transform: uppercase;
		opacity: 0.7;
		margin: 1.25rem 0;
	}

	.cassette-illustration {
		margin: 1rem 0;
		opacity: 0.6;
		position: relative;
	}

	.cassette-svg {
		display: block;
		margin: 0 auto;
	}

	/* Subtle reel animation */
	.reel {
		transform-origin: center;
	}

	.left-reel {
		animation: rotate 20s linear infinite;
	}

	.right-reel {
		animation: rotate 20s linear infinite reverse;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Scanner line animation */
	.scanner-line {
		animation: scan 4s ease-in-out infinite;
	}

	@keyframes scan {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.3;
		}
		50% {
			transform: translateY(5px);
			opacity: 0.5;
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
