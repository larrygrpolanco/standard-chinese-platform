<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { authStore } from '$lib/stores/authStore';
	import { getLatestUnit, getUserProgress } from '$lib/supabase/client';
	import ModuleCard from '$lib/components/UI/ModuleCard.svelte';

	let latestUnit = null;
	let completedCount = 0;

	onMount(async () => {
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
		}
	});
</script>

<svelte:head>
	<title>Taped Chinese | Digitized FSI Language Learning</title>
	<meta
		name="description"
		content="Learn Mandarin Chinese with digitized FSI course materials, including authentic audio recordings originally developed for U.S. diplomats."
	/>
</svelte:head>

<!-- Main container with paper texture background -->
<div class="landing-container">
	<!-- Hero Section -->
	<section class="hero-section">
		<div class="hero-content">
			<div class="hero-background-image"></div>

			<!-- Headline with retro underline -->
			<div class="title-container" in:fade={{ duration: 400, delay: 200 }}>
				<h1 class="main-title">Taped Chinese</h1>
				<div class="title-underline"></div>
			</div>

			<p class="subtitle">Diplomat-grade language training, now digitized and improved</p>

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

	<!-- RWP Section -->
	<section class="rwp-section">
		<div class="rwp-container">
			<!-- Decorative elements -->
			<div class="tape-corner top-left"></div>
			<div class="tape-corner top-right"></div>
			<div class="tape-corner bottom-left"></div>
			<div class="tape-corner bottom-right"></div>

			<!-- Content container -->
			<div class="rwp-content">
				<h2 class="section-title">Real World Practice (RWP)</h2>

				<p class="rwp-description">
					RWPs are exercises added to each unit which let you apply what you learn in each unit to
					real-life (or imagined) situations based on your interests, career, or goals. Instead of
					just repeating textbook phrases, you'll practice using Chinese in situations that matter
					to you.
					<br /> <br />
					While the classic FSI course excels at teaching structural patterns, it was designed for rapid
					memorization rather than creative language use. We hope that the RWPs added to each unit bridges
					this gap!
				</p>

				<a href="/rwp" class="rwp-button">
					<span class="button-text">Try it out</span>
					<svg class="arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</a>

				<!-- Tape visual element -->
				<div class="tape-circle border-opacity-10"></div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="stats-section">
		<div class="stats-container">
			<!-- Centered heading with decorative elements -->
			<div class="stats-header">
				<h2 class="stats-title">That's a lot of Chinese!</h2>
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
						<h3 class="feature-title">Authentic Materials</h3>
					</div>
					<p class="feature-description">
						Created by linguists to train US diplomats - tried, tested, and effective.
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
						<h3 class="feature-title">Flexible Learning</h3>
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
					comprehensive, structured, and parts of it still hold up to modern language pedagogy
					standards.
				</p>
				<p class="about-text">
					While the original cassette tapes and materials may be vintage, some of the teaching
					methods and philosophies still hold up to modern language teaching standards. Our goal is
					to preserve this resource and make it accessible to modern language learners. Everything
					is freely available as these materials are in the public domain.
				</p>
			</div>

			<!-- Decorative side -->
			<div class="about-decoration">
				<div class="stacked-items">
					<!-- Book illustration -->
					<div class="book-item">
						<div class="book-header"></div>
						<div class="book-lines">
							<div class="book-line"></div>
							<div class="book-line"></div>
							<div class="book-line"></div>
							<div class="book-line"></div>
						</div>
					</div>

					<!-- Cassette illustration -->
					<div class="cassette-item">
						<div class="cassette-readout"></div>
						<div class="cassette-reels">
							<div class="cassette-reel"></div>
							<div class="cassette-reel"></div>
						</div>
					</div>
				</div>
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
		max-width: 36rem;
	}

	.resource-button {
		display: inline-flex;
		align-items: center;
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

	.tape-corner {
		position: absolute;
		height: 1rem;
		width: 1rem;
		border: 1px solid var(--color-text);
		border-radius: 50%;
		opacity: 0.3;
	}

	.top-left {
		top: 0.75rem;
		left: 0.75rem;
	}

	.top-right {
		top: 0.75rem;
		right: 0.75rem;
	}

	.bottom-left {
		bottom: 0.75rem;
		left: 0.75rem;
	}

	.bottom-right {
		bottom: 0.75rem;
		right: 0.75rem;
	}

	.rwp-content {
		position: relative;
		z-index: 1;
		text-align: center;
	}

	.section-title {
		font-family: var(--font-serif);
		font-size: 2rem;
		font-weight: 700;
		color: var(--color-text);
		margin-bottom: 1rem;
	}

	.rwp-button {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 1.5rem;
		margin-bottom: 0.5rem;
		background-color: var(--color-cream-paper);
		border: 2px solid var(--color-terracotta);
		border-radius: 0.5rem;
		font-family: var(--font-sans);
		font-weight: 600;
		color: var(--color-terracotta);
		text-decoration: none;
		box-shadow: 2px 2px 0 var(--color-shadow);
		transition: all 0.2s ease;
	}

	.rwp-button:hover {
		background-color: var(--color-terracotta);
		color: white;
		transform: translate(1px, 1px);
		box-shadow: 1px 1px 0 var(--color-shadow);
	}

	.button-text {
		font-family: var(--font-sans);
		font-weight: 600;
	}

	.rwp-description {
		font-family: var(--font-sans);
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text);
		max-width: 48rem;
		margin: 1.5rem auto;
		text-align: center;
	}

	.tape-circle {
		position: absolute;
		border: 8px solid var(--color-text);
		border-opacity: 0.1;
		height: 6rem;
		width: 6rem;
		border-radius: 50%;
		right: 5rem;
		top: -1.5rem;
		transform: rotate(12deg);
		opacity: 0.1;
		pointer-events: none;
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

	.about-decoration {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
		min-height: 12rem;
	}

	.stacked-items {
		position: relative;
		height: 12rem;
		width: 16rem;
	}

	.book-item {
		position: absolute;
		bottom: 0;
		left: 1rem;
		height: 9rem;
		width: 12rem;
		transform: rotate(-8deg);
		border: 2px solid var(--color-text);
		border-radius: 0.25rem;
		background-color: #f9f4e8;
		overflow: hidden;
	}

	.book-header {
		height: 2rem;
		width: 100%;
		border-bottom: 2px solid var(--color-text);
		background-color: var(--color-avocado);
	}

	.book-lines {
		padding: 1rem;
	}

	.book-line {
		height: 0.5rem;
		background-color: #a0998a;
		margin-bottom: 0.75rem;
	}

	.cassette-item {
		position: absolute;
		top: 0;
		right: 0;
		height: 7rem;
		width: 11rem;
		transform: rotate(5deg);
		border: 2px solid var(--color-text);
		border-radius: 0.375rem;
		background-color: var(--color-cream-dark);
		overflow: hidden;
	}

	.cassette-readout {
		position: absolute;
		top: 0.5rem;
		left: 1rem;
		right: 1rem;
		height: 0.5rem;
		background-color: rgba(51, 49, 46, 0.1);
	}

	.cassette-readout::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 1.5rem;
		background-color: rgba(193, 124, 116, 0.6);
		animation: scan 3s infinite;
	}

	.cassette-reels {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 7rem;
		height: 3.5rem;
		display: flex;
		justify-content: space-between;
	}

	.cassette-reel {
		height: 2rem;
		width: 2rem;
		border-radius: 50%;
		border: 1px solid var(--color-text);
	}
</style>
