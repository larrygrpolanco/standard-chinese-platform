<!-- src/routes/modules/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { getModules } from '$lib/supabase/client';
	import Loader from '$lib/components/Loader.svelte';

	let modules = [];
	let loading = true;

	onMount(async () => {
		modules = await getModules();
		loading = false;
	});

	// Function to get color attributes based on module number
	function getModuleColors(moduleNumber) {
		const colors = [
			{ border: '#C17C74', bg: '#F8EBE8', accent: '#C17C74' }, // Terracotta
			{ border: '#7D8C5C', bg: '#EBEEE7', accent: '#7D8C5C' }, // Avocado
			{ border: '#DDB967', bg: '#F9F4E8', accent: '#DDB967' }, // Gold
			{ border: '#34667F', bg: '#EAF0F3', accent: '#34667F' } // Navy
		];
		return colors[(moduleNumber - 1) % colors.length];
	}
</script>

<svelte:head>
	<title>Modules | Taped Chinese</title>
	<meta
		name="description"
		content="Explore the FSI Standard Chinese course modules with authentic vintage audio recordings originally developed for U.S. diplomats."
	/>
</svelte:head>

<!-- Subtle paper texture background -->
<div class="page-background">
	<section class="container mx-auto px-4">
		<!-- Vintage-inspired header -->
		<header class="page-header">
			<!-- Decorative cassette tape icon -->
			<div class="decorative-tape">
				<div class="tape-body">
					<div class="tape-reels">
						<div class="tape-reel"></div>
						<div class="tape-reel"></div>
					</div>
				</div>
			</div>

			<!-- Title with retro underline -->
			<div class="title-container">
				<h1 class="page-title">
					Learning Modules
				</h1>
				<div class="title-underline"></div>
			</div>

			<p class="page-description">
				<br />
				Explore all 9 core modules of the FSI Standard Chinese course. These materials were originally
				developed for U.S. diplomats and come with authentic vintage audio recordings from the original
				tape collection.
			</p>
		</header>

		{#if loading}
			<!-- Loading animation with spinning cassette reels -->
			<Loader />
		{:else}
			<!-- Module cards container -->
			<div class="module-cards-container">
				{#each modules as module}
					<!-- Module card styled as vintage cassette case -->
					{@const colors = getModuleColors(module.id)}
					<a
						href="/modules/{module.id}"
						class="module-card"
						style="--accent-color: {colors.accent}; --bg-color: {colors.bg};"
					>
						<!-- Top colored binding -->
						<div class="module-binding"></div>

						<!-- Card content -->
						<div class="module-content">
							<!-- Left section with title and badge -->
							<div class="module-header">
								<!-- Module number and title container -->
								<div class="module-title-section">
									<!-- Module number badge -->
									<div class="module-number-badge">
										<span class="module-number">{module.id}</span>
									</div>

									<!-- Title -->
									<h2 class="module-title">{module.title}</h2>

									<!-- Small tape icon -->
									<div class="tape-icon">
										<svg
											width="24"
											height="24"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<rect
												x="2"
												y="4"
												width="20"
												height="16"
												rx="2"
												stroke="#33312E"
												stroke-width="2"
											/>
											<circle cx="7" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
											<circle cx="17" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
											<line
												x1="9.5"
												y1="12"
												x2="14.5"
												y2="12"
												stroke="#33312E"
												stroke-width="1.5"
											/>
										</svg>
									</div>
								</div>

								<!-- Progress meter styled as tape counter -->
								<div class="progress-meter-container">
									<div class="progress-label-container">
										<div class="progress-label">PROGRESS:</div>
										<div class="progress-bar-container">
											<!-- Progress bar -->
											<div class="progress-bar"></div>
											<!-- Tick marks -->
											<div class="progress-ticks">
												{#each Array(4) as _, i}
													<span class="progress-tick"></span>
												{/each}
											</div>
										</div>
									</div>
									<p class="progress-status">SIDE A - NOT STARTED</p>
								</div>
							</div>

							<!-- Middle divider -->
							<div class="module-divider"></div>

							<!-- Bottom section with description and CTA -->
							<div class="module-footer">
								<!-- Module description -->
								<div class="module-description-container">
									<p class="module-description">{module.description}</p>
								</div>

								<!-- Call to action styled as a mechanical button -->
								<div class="module-cta-container">
									<span class="module-cta-button">
										Start learning
										<svg
											class="cta-arrow"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M14 5l7 7m0 0l-7 7m7-7H3"
											/>
										</svg>
									</span>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</div>

<style>
	/* Page background */
	.page-background {
		min-height: 100vh;
		background-color: #F4F1DE;
		padding-bottom: 3rem;
		background-image: url('/textures/subtle-paper.png');
		background-repeat: repeat;
		background-blend-mode: overlay;
	}

	/* Header styling */
	.page-header {
		position: relative;
		margin-bottom: 2.5rem;
		padding-top: 1.5rem;
	}

	.decorative-tape {
		position: absolute;
		top: -0.5rem;
		right: 2rem;
		height: 4rem;
		width: 6rem;
		transform: rotate(12deg);
		opacity: 0.3;
		display: none;
	}

	@media (min-width: 768px) {
		.decorative-tape {
			display: block;
		}
	}

	.tape-body {
		position: relative;
		height: 100%;
		width: 100%;
		border-radius: 0.375rem;
		border: 2px solid #33312E;
		background-color: #E8E5D7;
	}

	.tape-reels {
		position: absolute;
		top: 50%;
		left: 50%;
		height: 2rem;
		width: 2.5rem;
		transform: translate(-50%, -50%);
	}

	.tape-reel {
		position: absolute;
		top: 0;
		height: 1rem;
		width: 1rem;
		border-radius: 50%;
		border: 1px solid #33312E;
	}

	.tape-reel:first-child {
		left: 0;
	}

	.tape-reel:last-child {
		right: 0;
	}

	.title-container {
		position: relative;
		display: inline-block;
	}

	.page-title {
		font-family: 'Arvo', serif;
		font-size: 2.5rem;
		font-weight: bold;
		color: #33312E;
	}

	.title-underline {
		position: absolute;
		bottom: -0.5rem;
		left: 0;
		height: 0.375rem;
		width: 100%;
		background-color: #DDB967;
	}

	.page-description {
		margin-top: 1.5rem;
		max-width: 36rem;
		font-family: 'Work Sans', sans-serif;
		line-height: 1.625;
		color: #33312E;
		opacity: 0.8;
	}

	/* Module cards container */
	.module-cards-container {
		display: flex;
		flex-direction: column;
		gap: 1rem; /* Spacing between cards */
	}

	/* Module card styling */
	.module-card {
		position: relative;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border-radius: 0.5rem;
		border: 2px solid #33312E;
		background-color: #E8E5D7;
		box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 2px 2px 0 #826D5B;
		transition: all 0.2s;
	}

	.module-card:hover {
		transform: translateY(-0.25rem);
		box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 4px 4px 0 #826D5B;
	}

	/* Top colored binding */
	.module-binding {
		height: 0.75rem;
		width: 100%;
		background-color: var(--bg-color);
		border-bottom: 2px solid #33312E;
	}

	/* Card content */
	.module-content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	/* Header section with badge and title */
	.module-header {
		padding: 1.5rem;
	}

	.module-title-section {
		position: relative;
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
	}

	.module-number-badge {
		display: flex;
		height: 3.5rem;
		width: 3.5rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		border: 2px solid #33312E;
		background-color: var(--bg-color);
		transform: rotate(-5deg);
		box-shadow: 1px 1px 0 #826D5B;
	}

	.module-number {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: bold;
		color: #33312E;
	}

	.module-title {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		flex-grow: 1;
		color: #33312E;
		transition: color 0.15s;
	}

	.module-card:hover .module-title {
		color: #C17C74;
	}

	.tape-icon {
		position: absolute;
		top: 0;
		right: 0;
		opacity: 0.7;
	}

	/* Progress meter */
	.progress-meter-container {
		margin-top: 1rem;
	}

	.progress-label-container {
		display: flex;
		align-items: center;
	}

	.progress-label {
		margin-right: 0.5rem;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		letter-spacing: -0.025em;
		opacity: 0.8;
	}

	.progress-bar-container {
		position: relative;
		height: 1rem;
		flex-grow: 1;
		overflow: hidden;
		border-radius: 0.125rem;
		border: 1px solid #33312E;
		background-color: #F4F1DE;
		box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
	}

	.progress-bar {
		height: 100%;
		width: 0;
		transition: width 0.3s ease-out;
		background-color: var(--accent-color);
		opacity: 0.8;
	}

	.progress-ticks {
		position: absolute;
		top: 0;
		left: 3rem;
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: space-between;
		padding: 0 0.25rem;
		pointer-events: none;
	}

	.progress-tick {
		margin-top: 0.25rem;
		height: 0.25rem;
		width: 1px;
		background-color: #33312E;
		opacity: 0.4;
	}

	.progress-status {
		margin-top: 0.25rem;
		font-family: 'Courier New', monospace;
		font-size: 0.75rem;
		color: #33312E;
		opacity: 0.7;
	}

	/* Middle divider */
	.module-divider {
		display: flex;
		align-items: center;
		padding: 0 1rem;
	}

	.module-divider::before {
		content: '';
		flex-grow: 1;
		border-top: 1px dashed #A0998A;
	}

	/* Footer section with description and CTA */
	.module-footer {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.module-description-container {
		flex-grow: 1;
		background-color: rgba(244, 241, 222, 0.5);
		padding: 1rem;
	}

	.module-description {
		font-family: 'Work Sans', sans-serif;
		font-size: 0.875rem;
		line-height: 1.5;
		color: #33312E;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
	}

	.module-cta-container {
		border-top: 2px solid #33312E;
		padding: 0.75rem;
		text-align: right;
		background: repeating-linear-gradient(45deg, rgba(var(--accent-color-rgb, 0, 0, 0), 0.05), rgba(var(--accent-color-rgb, 0, 0, 0), 0.05) 10px, transparent 10px, transparent 20px);
	}

	.module-cta-button {
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		border: 1px solid #33312E;
		background-color: #F4F1DE;
		padding: 0.375rem 1rem;
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312E;
		box-shadow: 1px 1px 0 #826D5B;
		transition: all 0.15s ease-out;
	}

	.module-card:hover .module-cta-button {
		transform: translateY(-0.125rem);
		box-shadow: 2px 2px 0 #826D5B;
	}

	.module-card:active .module-cta-button {
		transform: translateY(0.125rem);
		box-shadow: none;
	}

	.cta-arrow {
		margin-left: 0.375rem;
		height: 1rem;
		width: 1rem;
		transition: transform 0.2s;
	}

	.module-card:hover .cta-arrow {
		transform: translateX(0.25rem);
	}

	/* Desktop layout modifications */
	@media (min-width: 768px) {
		.module-card {
			flex-direction: row;
			height: auto;
		}

		.module-binding {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 0.75rem;
			border-bottom: none;
			border-right: 2px solid #33312E;
		}

		.module-content {
			flex-direction: row;
			margin-left: 0.75rem;
			width: calc(100% - 0.75rem);
		}

		.module-header {
			flex: 1;
			padding: 1.5rem 1rem 1.5rem 1.5rem;
			border-right: none; 
		}

		.module-footer {
			flex: 1.5;
			flex-direction: column;
			border-left: 1px dashed #A0998A;
		}

		.module-divider {
			display: none;
		}

		.module-description-container {
			padding: 1.5rem;
		}

		.module-cta-container {
			border-left: none;
		}
	}
</style>