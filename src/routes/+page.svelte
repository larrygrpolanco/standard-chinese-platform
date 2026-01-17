<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fade, fly, slide } from 'svelte/transition';
	import { authStore } from '$lib/stores/authStore';
	import { getLatestUnit, getUserProgress, createCheckoutSession } from '$lib/supabase/client';
	import ModuleCard from '$lib/components/UI/ModuleCard.svelte';
	import SupportSection from '$lib/components/UI/SupportSection.svelte';

	// Add dispatch for toast events
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let visible = false;

	// Function to check if element is in viewport
	function checkVisibility() {
		const section = document.querySelector('.rwp-section');
		if (!section) return;

		const rect = section.getBoundingClientRect();
		const isVisible = rect.top <= window.innerHeight * 0.7;

		if (isVisible) {
			visible = true;
		}
	}

	let latestUnit = null;
	let completedCount = 0;

	onMount(async () => {
		// Initial check
		checkVisibility();

		// Add scroll listener
		window.addEventListener('scroll', checkVisibility);

		// Wait for auth initialization to complete
		await authStore.initialize();

		// Only fetch if user is logged in
		if ($authStore) {
			// Fetch latest unit and user progress in parallel
			const [latestUnitData, progressData] = await Promise.all([
				getLatestUnit(),
				getUserProgress()
			]);

			latestUnit = latestUnitData;

			// Simply count completed units
			if (progressData && progressData.length > 0) {
				completedCount = progressData.filter((item) => item.status === 'completed').length;
			}
			return () => {
				window.removeEventListener('scroll', checkVisibility);
			};
		}
	});
</script>

<svelte:head>
	<title>Taped Chinese | Digitized FSI Language Learning</title>
	<meta
		name="description"
		content="Learn Mandarin Chinese with digitized FSI course materials, including authentic audio recordings originally developed for U.S. diplomats."
	/>
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://www.tapedchinese.com/" />
	<meta property="og:title" content="Taped Chinese | Digitized FSI Language Learning" />
	<meta property="og:description" content="Learn Mandarin Chinese with digitized FSI course materials, including authentic audio recordings originally developed for U.S. diplomats." />
	<meta property="og:image" content="https://www.tapedchinese.com/android-chrome-512x512.png" />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content="https://www.tapedchinese.com/" />
	<meta name="twitter:title" content="Taped Chinese | Digitized FSI Language Learning" />
	<meta name="twitter:description" content="Learn Mandarin Chinese with digitized FSI course materials, including authentic audio recordings originally developed for U.S. diplomats." />
	<meta name="twitter:image" content="https://www.tapedchinese.com/android-chrome-512x512.png" />
	
	<!-- Canonical URL -->
	<link rel="canonical" href="https://www.tapedchinese.com/" />
</svelte:head>

<!-- Main container with paper texture background -->
<div class="landing-container">
	<!-- Hero Section -->
	<section class="hero-section">
		<div class="hero-content">
			<div class="hero-background-image"></div>

			<!-- Demo Banner -->
			<div class="demo-banner" in:fade={{ duration: 400, delay: 100 }}>
				<p class="demo-text">Demo Site - No longer supported, but still working for testing. Try out the RWP feature!</p>
			</div>

			<!-- Headline with retro underline -->
			<div class="title-container" in:fade={{ duration: 400, delay: 200 }}>
				<h1 class="main-title">Taped Chinese</h1>
				<div class="title-underline"></div>
			</div>

			<p class="subtitle">
				Foreign Service Institute language training, now digitized and improved
			</p>

			<!-- Core Module Card -->
			<ModuleCard {authStore} {latestUnit} {completedCount} />

			<!-- Resource Guide Button -->
			<div class="resource-guide-container" in:fade={{ duration: 400, delay: 600 }}>
				<a href="/resource" class="resource-button">
					<span class="button-icon">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="guidebook-icon"
						>
							<path
								d="M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235"
								stroke="#1C274D"
								stroke-width="1.5"
							></path>
							<path d="M8 7H16" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"></path>
							<path d="M8 10.5H13" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"
							></path>
							<path d="M19.5 19H8" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"
							></path>
							<path
								d="M10 22C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8M14 22C16.8284 22 18.2426 22 19.1213 21.1213C20 20.2426 20 18.8284 20 16V12"
								stroke="#1C274D"
								stroke-width="1.5"
								stroke-linecap="round"
							></path>
						</svg>
					</span>
					Resource Guide
					<svg class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</a>
				<p class="resource-description">
					Checkout our guide to learn more about how to use this resource to fit your learning
					styles and other language learning tips
				</p>
			</div>
		</div>
	</section>

	<section class="rwp-section">
		<div class="rwp-container">
			<!-- Decorative corners (matching page style) -->
			<div class="tape-corner top-left"></div>
			<div class="tape-corner top-right"></div>
			<div class="tape-corner bottom-left"></div>
			<div class="tape-corner bottom-right"></div>

			<!-- Content container -->
			<div class="rwp-content">
				<h2 class="section-title">Relevant World Practice (RWP)</h2>

				<div class="rwp-explanation">
					{#if visible}
						<div in:fade={{ duration: 700, delay: 100 }} class="explanation-highlight">
							<p class="highlight-text">
								Exercises that adapt to <em>your</em> story, not the other way around
							</p>
						</div>

						<div class="explanation-grid">
							<div in:fly={{ y: 20, duration: 600, delay: 200 }} class="explanation-item">
								<div class="item-number pulse-animate">1</div>
								<div class="item-content">
									<h3 class="item-title">Personalized Stories</h3>
									<p class="item-description">
										Generated stories that use each unit's vocabulary and dialogues, connecting them to your interests and goals
									</p>
								</div>
							</div>

							<div in:fly={{ y: 20, duration: 600, delay: 350 }} class="explanation-item">
								<div class="item-number pulse-animate">2</div>
								<div class="item-content">
									<h3 class="item-title">Custom Audio</h3>
									<p class="item-description">
										Listen to your RWPs with text-to-speech voices for extra listening practice
									</p>
								</div>
							</div>

							<div in:fly={{ y: 20, duration: 600, delay: 500 }} class="explanation-item">
								<div class="item-number pulse-animate">3</div>
								<div class="item-content">
									<h3 class="item-title">Targeted Practice</h3>
									<p class="item-description">
										Multiple-choice, short-answer, and reflection questions that test your
										comprehension in meaningful contexts
									</p>
								</div>
							</div>
						</div>

						<div in:fade={{ duration: 700, delay: 700 }} class="rwp-footer">
							<p class="rwp-tagline">
								While the classic FSI course excels at teaching language forms, RWP means to bridge
								the gap between memorization and creative, personally relevant language use.
							</p>

							<a href="/rwp" class="rwp-button">
								<span class="button-text">See How It Works</span>
								<svg class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									/>
								</svg>
							</a>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="stats-section">
		<div class="stats-container">
			<!-- Centered heading with decorative elements -->
			<div class="stats-header">
				<h2 class="stats-title">That's a lot of Chinese</h2>
			</div>

			<!-- Stat grid -->
			<div class="stats-grid">
				<!-- Hours of Audio -->
				<div class="stat-item">
					<div class="stat-value red">
						<span>59</span>
						<div class="stat-highlight"></div>
					</div>
					<div class="stat-label">Hours of Audio</div>
				</div>

				<!-- Learning Modules -->
				<div class="stat-item">
					<div class="stat-value blue">
						<span>55</span>
						<div class="stat-highlight"></div>
					</div>
					<div class="stat-label">Learning Modules</div>
				</div>

				<!-- Pages of Instruction -->
				<div class="stat-item">
					<div class="stat-value gold">
						<span>2,496</span>
						<div class="stat-highlight"></div>
					</div>
					<div class="stat-label">Pages of Material</div>
				</div>
			</div>

			<!-- Features Section -->
			<div class="features-grid">
				<div class="feature-card red-card">
					<div class="feature-header">
						<svg class="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<h3 class="feature-title">Free Forever</h3>
					</div>
					<p class="feature-description">
						This digitized FSI course will always be free and accessible to everyone.
					</p>
				</div>

				<div class="feature-card green-card">
					<div class="feature-header">
						<svg class="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
							/>
						</svg>
						<h3 class="feature-title">Comprehensive Materials</h3>
					</div>
					<p class="feature-description">
						Created to train US diplomats up to a professional proficiency in a relatively short
						time.
					</p>
				</div>

				<div class="feature-card gold-card">
					<div class="feature-header">
						<svg class="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
							/>
						</svg>
						<h3 class="feature-title">"Modular" Learning</h3>
					</div>
					<p class="feature-description">
						Choose your own path through the material - learn at your own pace and style.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- About Section -->
	<section class="about-section">
		<div class="about-container">
			<!-- Content side -->
			<div id="about" class="about-content">
				<h2 class="about-title">
					About This Project
					<span class="title-underline"></span>
					<span class="title-highlight"></span>
				</h2>
				<p class="about-text">
					Taped Chinese digitizes the Foreign Service Institute's "Standard Chinese: A Modular
					Approach" course materials from the 1970s, which were created to be flexible enough to
					meet the requirements of government agencies and academic institutions. While dated, it is
					comprehensive, structured, and in the public domain, so its free.
				</p>
				<p class="about-text">
					While vintage and flawed, these language materials contain some solid teaching foundations
					that still hold up to modern language teaching standards. The goal of Taped Chinese is to
					make these resources accessible digitally, and the added RWPs address the original
					course's weaknesses while still taking advantage of what it does well, structured
					comprehensible input. If you find this project valuable, please consider supporting it for
					$5/month to help with operating costs and future work.
				</p>
			</div>

			<!-- Decorative side -->
			<div class="about-support">
				<SupportSection on:toast={(e) => dispatch('toast', e.detail)} />
			</div>
		</div>
	</section>
</div>

<style>
	/* Base Styles and Variables */
	:root {
		--color-cream-paper: #f5f2e8;
		--color-cream-dark: #e8e5d7;
		--color-terracotta: #c17c74;
		--color-avocado: #7d8c5c;
		--color-gold: #ddb967;
		--color-navy: #34667f;
		--color-text: #33312e;
		--color-text-light: #4b4945;
		--color-shadow: #826d5b;
		--font-serif: 'Arvo', serif;
		--font-sans: 'Work Sans', sans-serif;
		--font-mono: 'Courier New', monospace;
	}

	/* Main Container */
	.landing-container {
		background-color: var(--color-cream-paper);
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			radial-gradient(circle at 15% 25%, rgba(221, 185, 103, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 85% 75%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
		animation: subtleGradientShift 120s ease-in-out infinite;
		background-size:
			auto,
			200% 200%,
			200% 200%,
			100% 100%;
		min-height: 100vh;
		background-attachment: fixed;
	}

	@keyframes subtleGradientShift {
		0% {
			background-position:
				0% 0%,
				0% 0%,
				0% 0%,
				0% 0%;
		}
		50% {
			background-position:
				0% 0%,
				10% 20%,
				90% 70%,
				0% 0%;
		}
		100% {
			background-position:
				0% 0%,
				0% 0%,
				0% 0%,
				0% 0%;
		}
	}

	/* Hero Section */
	.hero-section {
		padding: 1rem 1rem;
		display: flex;
		justify-content: center;
	}

 	.hero-content {
		max-width: 1200px;
		position: relative;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.demo-banner {
		margin-bottom: 1rem;
		padding: 0.75rem 1rem;
		background-color: rgba(193, 124, 116, 0.1);
		border: 2px solid var(--color-text);
		border-radius: 0.5rem;
		box-shadow: 2px 2px 0 var(--color-shadow);
		text-align: center;
	}

	.demo-text {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--color-text);
		margin: 0;
		line-height: 1.4;
	}

	.hero-background-image {
		position: absolute;
		top: 0;
		right: 5%;
		width: 200px;
		height: 200px;
		background-image: url('/images/vintage-cassette.png');
		background-size: contain;
		background-repeat: no-repeat;
		opacity: 0.08;
		transform: rotate(15deg);
		pointer-events: none;
		z-index: 0;
	}

	.title-container {
		position: relative;
		margin-bottom: 1.5rem;
		text-align: center;
	}

	.main-title {
		font-family: var(--font-serif);
		font-size: 3rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 0.5rem;
	}

	.title-underline {
		position: absolute;
		bottom: -0.5rem;
		left: 50%;
		margin-bottom: 0.5rem;
		height: 0.3rem;
		width: 50%;
		background: #ddb967;
	}

	.subtitle {
		font-family: var(--font-sans);
		font-size: 1.25rem;
		text-align: center;
		color: var(--color-text);
		opacity: 0.9;
		margin-bottom: 1.5rem;
		max-width: 36rem;
	}

	.resource-guide-container {
		margin-top: 1rem;
		/* margin-bottom: 1.5rem; */
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		max-width: 36rem;
	}

	.resource-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		background-color: var(--color-cream-dark);
		border: 2px solid var(--color-text);
		border-radius: 0.5rem;
		font-family: var(--font-sans);
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text);
		text-decoration: none;
		box-shadow: 2px 2px 0 var(--color-shadow);
		transition: all 0.2s ease;
		margin-bottom: 0.25rem;
		overflow: hidden;
		position: relative;
		width: 100%;
	}

	.resource-button:hover {
		transform: translateY(-0.25rem);
		box-shadow: 4px 4px 0 var(--color-shadow);
	}

	.resource-button:active {
		transform: translateY(0);
		box-shadow: none;
	}

	.button-icon {
		margin-right: 0.5rem;
	}

	.guidebook-icon {
		transition: transform 0.2s ease;
	}

	.resource-button:hover .guidebook-icon {
		transform: rotate(12deg);
	}

	.arrow-icon {
		height: 1.25rem;
		width: 1.25rem;
		margin-left: 0.5rem;
		transition: transform 0.2s ease;
	}

	.resource-button:hover .arrow-icon {
		transform: translateX(0.25rem);
	}

	.resource-description {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		font-style: italic;
		text-align: center;
		color: var(--color-text);
		opacity: 0.6;
		padding: 0 0.5rem;
	}

	/* RWP Section */
	.rwp-section {
		padding: 1.5rem 1rem;
		display: flex;
		justify-content: center;
	}

	.rwp-container {
		position: relative;
		max-width: 1200px;
		width: 100%;
		padding: 2rem;
		border: 2px solid var(--color-text);
		border-radius: 0.5rem;
		background-color: var(--color-cream-dark);
		box-shadow:
			inset 0 1px 4px rgba(51, 49, 46, 0.15),
			4px 4px 0 var(--color-shadow);
		overflow: hidden;
		background-image:
			radial-gradient(circle at 15% 50%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 85% 30%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
	}

	.rwp-content {
		position: relative;
		z-index: 1;
	}

	.rwp-content::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 v100 M30 20 v60 M70 20 v60 M10 40 v20 M90 40 v20' stroke='%23000000' stroke-opacity='0.03' stroke-width='1' fill='none'/%3E%3C/svg%3E");
		background-size: 80px 80px;
		z-index: -1;
		opacity: 0.4;
		pointer-events: none;
	}

	.section-title {
		font-family: var(--font-serif);
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 1.5rem;
		text-align: center;
		position: relative;
	}

	.section-title::after {
		content: '';
		position: absolute;
		bottom: -0.5rem;
		left: 50%;
		transform: translateX(-50%);
		width: 80px;
		height: 3px;
		background-color: var(--color-gold);
	}

	/* Explanation Section */
	.rwp-explanation {
		max-width: 900px;
		margin: 0 auto;
	}

	.explanation-highlight {
		background-color: rgba(221, 185, 103, 0.15);
		border-left: 3px solid var(--color-gold);
		padding: 1rem 1.5rem;
		margin-bottom: 2rem;
		border-radius: 0 0.25rem 0.25rem 0;
		position: relative;
		overflow: hidden;
	}

	.explanation-highlight::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 3px;
		opacity: 0.7;
		background: linear-gradient(-90deg, var(--color-gold), transparent);
		animation: shimmer 10s infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.highlight-text {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		color: var(--color-text);
		text-align: center;
		margin: 0;
	}

	.highlight-text em {
		font-style: normal;
		color: var(--color-navy);
		font-weight: 600;
		position: relative;
		display: inline-block;
	}

	.highlight-text em::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 2px;
		background-color: var(--color-navy);
		transform: scaleX(0);
		transform-origin: bottom right;
		transition: transform 0.4s ease-out;
	}

	.highlight-text:hover em::after {
		transform: scaleX(1);
		transform-origin: bottom left;
	}

	.explanation-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 768px) {
		.explanation-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.explanation-item {
		display: flex;
		background-color: rgba(255, 255, 255, 0.5);
		border: 1px solid rgba(51, 49, 46, 0.1);
		border-radius: 0.5rem;
		padding: 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		transition: all 0.3s ease;
		position: relative;
		overflow: hidden;
	}

	.explanation-item:hover {
		transform: translateY(-3px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.explanation-item::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
		opacity: 0;
		transition: opacity 0.4s ease;
		pointer-events: none;
	}

	.explanation-item:hover::after {
		opacity: 0.4;
	}

	.item-number {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 32px;
		width: 32px;
		flex-shrink: 0;
		margin-right: 1rem;
		border-radius: 50%;
		background-color: var(--color-avocado);
		color: white;
		font-family: var(--font-serif);
		font-weight: 700;
		position: relative;
	}

	.pulse-animate {
		position: relative;
	}

	.pulse-animate::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		animation: pulse 2s ease-out infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 rgba(125, 140, 92, 0.5);
		}
		70% {
			box-shadow: 0 0 0 10px rgba(125, 140, 92, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(125, 140, 92, 0);
		}
	}

	.explanation-item:nth-child(2) .item-number {
		background-color: var(--color-terracotta);
	}

	.explanation-item:nth-child(2) .pulse-animate::after {
		animation: pulse-red 2s ease-out infinite;
	}

	@keyframes pulse-red {
		0% {
			box-shadow: 0 0 0 0 rgba(193, 124, 116, 0.5);
		}
		70% {
			box-shadow: 0 0 0 10px rgba(193, 124, 116, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(193, 124, 116, 0);
		}
	}

	.explanation-item:nth-child(3) .item-number {
		background-color: var(--color-navy);
	}

	.explanation-item:nth-child(3) .pulse-animate::after {
		animation: pulse-navy 2s ease-out infinite;
	}

	@keyframes pulse-navy {
		0% {
			box-shadow: 0 0 0 0 rgba(52, 102, 127, 0.5);
		}
		70% {
			box-shadow: 0 0 0 10px rgba(52, 102, 127, 0);
		}
		100% {
			box-shadow: 0 0 0 0 rgba(52, 102, 127, 0);
		}
	}

	.item-content {
		flex: 1;
	}

	.item-title {
		font-family: var(--font-serif);
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--color-text);
		margin: 0 0 0.5rem 0;
		position: relative;
		display: inline-block;
	}

	.item-title::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 40px;
		height: 2px;
		background-color: currentColor;
		opacity: 0.4;
		transition: width 0.3s ease;
	}

	.explanation-item:hover .item-title::after {
		width: 100%;
	}

	.item-description {
		font-family: var(--font-sans);
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--color-text-light);
		margin: 0;
	}

	.rwp-footer {
		text-align: center;
		margin-top: 2rem;
		position: relative;
	}

	.rwp-footer::before {
		content: '';
		position: absolute;
		top: -1rem;
		left: 50%;
		transform: translateX(-50%);
		width: 150px;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--color-text-light), transparent);
		opacity: 0.2;
	}

	.rwp-tagline {
		font-family: var(--font-sans);
		font-size: 1rem;
		color: var(--color-text);
		max-width: 700px;
		margin: 0 auto 1.5rem auto;
		padding: 0 1rem;
		line-height: 1.6;
	}

	.rwp-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1.5rem;
		background-color: var(--color-cream-paper);
		border: 2px solid var(--color-terracotta);
		border-radius: 0.5rem;
		font-family: var(--font-sans);
		font-weight: 600;
		color: var(--color-terracotta);
		text-decoration: none;
		box-shadow: 2px 2px 0 var(--color-shadow);
		transition: all 0.2s ease;
		position: relative;
		overflow: hidden;
		width: 100%;
	}

	.rwp-button::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: rgba(193, 124, 116, 0.1);
		transition: transform 0.5s ease;
	}

	.rwp-button:hover::before {
		transform: translateX(100%);
	}

	.rwp-button:hover {
		background-color: var(--color-terracotta);
		color: white;
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0 var(--color-shadow);
	}

	.rwp-button:hover .arrow-icon {
		transform: translateX(0.25rem);
	}

	.arrow-icon {
		height: 1.25rem;
		width: 1.25rem;
		margin-left: 0.5rem;
		transition: transform 0.2s ease;
	}

	/* Stats Section */
	.stats-section {
		position: relative;
		overflow: hidden;
		padding: 2.5rem 1rem;
		background-color: var(--color-cream-dark);
		display: flex;
		justify-content: center;
	}

	.stats-section::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100%;
		background-image: url('/images/chinese-calligraphy.jpg');
		background-size: cover;
		background-position: center;
		opacity: 0.04;
		pointer-events: none;
		filter: grayscale(1);
	}

	.stats-container {
		max-width: 1200px;
		width: 100%;
	}

	.stats-header {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.stats-title {
		position: relative;
		display: inline-block;
		font-family: var(--font-serif);
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-navy);
	}

	.stats-title::before,
	.stats-title::after {
		content: '';
		position: absolute;
		top: 0;
		height: 2px;
		width: 1.5rem;
		background-color: var(--color-gold);
	}

	.stats-title::before {
		left: -2rem;
	}

	.stats-title::after {
		right: -2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 768px) {
		.stats-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.stat-value {
		position: relative;
		font-family: var(--font-serif);
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 0.25rem;
	}

	.stat-value.red {
		color: var(--color-terracotta);
	}

	.stat-value.blue {
		color: var(--color-navy);
	}

	.stat-value.gold {
		color: var(--color-gold);
	}

	.stat-highlight {
		position: absolute;
		top: 0;
		right: -1rem;
		height: 100%;
		width: 0.25rem;
		animation: pulse 2s infinite;
	}

	.stat-value.red .stat-highlight {
		background-color: rgba(193, 124, 116, 0.3);
	}

	.stat-value.blue .stat-highlight {
		background-color: rgba(52, 102, 127, 0.3);
	}

	.stat-value.gold .stat-highlight {
		background-color: rgba(221, 185, 103, 0.3);
	}

	@keyframes pulse {
		0% {
			opacity: 0.3;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.3;
		}
	}

	.stat-label {
		font-family: var(--font-sans);
		font-weight: 500;
		color: var(--color-avocado);
	}

	/* Features Grid */
	.features-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;
		margin: 3rem auto;
		max-width: 1200px;
	}

	@media (min-width: 768px) {
		.features-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.feature-card {
		border: 2px solid var(--color-text);
		border-radius: 0.5rem;
		padding: 1rem;
		text-align: center;
		box-shadow: 2px 2px 0 var(--color-shadow);
	}

	.red-card {
		background-color: #f8ebe8;
	}

	.green-card {
		background-color: #ebeee7;
	}

	.gold-card {
		background-color: #f9f4e8;
	}

	.feature-header {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.5rem;
	}

	.feature-icon {
		height: 1.25rem;
		width: 1.25rem;
		margin-right: 0.5rem;
	}

	.red-card .feature-icon {
		color: var(--color-terracotta);
	}

	.green-card .feature-icon {
		color: var(--color-avocado);
	}

	.gold-card .feature-icon {
		color: var(--color-gold);
	}

	.feature-title {
		font-family: var(--font-serif);
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-text);
	}

	.feature-description {
		font-family: var(--font-sans);
		font-size: 0.875rem;
		color: var(--color-text);
	}

	/* About Section */
	.about-section {
		padding: 1.5rem 1rem 0 1rem;

		background-color: var(--color-cream-paper);
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			radial-gradient(circle at 75% 25%, rgba(221, 185, 103, 0.07) 0%, transparent 45%),
			radial-gradient(circle at 25% 75%, rgba(52, 102, 127, 0.07) 0%, transparent 45%);
		display: flex;
		justify-content: center;
		display: flex;
		justify-content: center;
	}

	.about-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: 1200px;
		width: 100%;
	}

	@media (min-width: 768px) {
		.about-container {
			flex-direction: row;
			align-items: stretch;
		}
	}

	.about-content {
		padding: 1rem;
		flex: 1;
	}

	.about-title {
		position: relative;
		font-family: var(--font-serif);
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 1rem;
		display: inline-block;
	}

	.title-underline {
		position: absolute;
		bottom: -0.5rem;
		left: 0;
		height: 5px;
		width: 100%;
		background-color: #ddb967;
	}

	.title-highlight {
		position: absolute;
		bottom: -0.25rem;
		left: 0;
		height: 2px;
		width: 25%;
		background-color: var(--color-terracotta);
		/* animation: pulse 3s infinite; */
	}

	.about-text {
		font-family: var(--font-sans);
		line-height: 1.7;
		color: var(--color-text);
		margin-bottom: 1rem;
	}

	.about-support {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
		min-height: 12rem;
		max-width: 36rem;
	}
</style>
