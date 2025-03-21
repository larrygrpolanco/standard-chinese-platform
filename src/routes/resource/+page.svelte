<!-- src/routes/resource/+page.svelte -->
<script>
	import { onMount } from 'svelte';

	// Function to scroll to learning guide sections
	function scrollToLearningGuide() {
		const learningGuideSection = document.getElementById('learning-guide');
		if (learningGuideSection) {
			learningGuideSection.scrollIntoView({ behavior: 'smooth' });
		}
	}

	// Resource module structure for the cards
	const resourceModules = [
		{
			id: 1,
			title: 'Pronunciation & Romanization',
			description: 'Basic Chinese sounds and pinyin system',
			tapes: 6,
			coreModules: 'Core Module 1',
			path: 'pronunciation-romanization'
		},
		{
			id: 2,
			title: 'Numbers',
			description: 'Cardinal and ordinal numbers',
			tapes: 6,
			coreModules: 'Core Modules 1 & 3',
			path: 'numbers'
		},
		{
			id: 3,
			title: 'Time and Dates',
			description: 'Expressing time and calendar dates',
			tapes: 4,
			coreModules: 'Core Modules 2 & 3',
			path: 'time-dates'
		},
		{
			id: 4,
			title: 'Classroom Expressions',
			description: 'Common phrases used in learning environments',
			tapes: 2,
			coreModules: 'Core Modules 1 & 2',
			path: 'classroom-expressions'
		}
	];

	// Generate colors based on module number to keep consistency
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
	<title>Resource Guide | Taped Chinese</title>
	<meta
		name="description"
		content="Learn how to effectively use the FSI Chinese Learning Platform and access additional resource modules for beginners."
	/>
</svelte:head>

<!-- Subtle paper texture background -->
<div class="page-background">
	<section class="container mx-auto px-4">
		<!-- Vintage-inspired header -->
		<header class="page-header">
			<!-- Title with retro underline -->
			<div class="title-container">
				<h1 class="page-title">Resource Guide</h1>
				<div class="title-underline"></div>
			</div>

			<p class="page-description">
				Checkout our resource guide to learn more about how to use this resource to fit your
				learning styles and other language learning tips.
			</p>

			<div class="header-buttons">
				<a href="/modules" class="primary-button">
					Get Started
					<svg class="button-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</a>
				<button class="secondary-button" on:click={scrollToLearningGuide}>
					Learning Guide
					<svg class="button-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 14l-7 7m0 0l-7-7m7 7V3"
						/>
					</svg>
				</button>
			</div>
		</header>

		<!-- Resource Modules Section (moved to the top) -->
		<div class="content-section">
			<h2 class="section-title">Resource Modules</h2>
			<div class="section-content">
				<div class="resource-module-warning">
					<p>
						<strong>Note:</strong> This course will not be easy for complete beginners. It needs to be
						a supplement or for someone looking to brush up. Still, we offer the resource module tapes
						below for those starting from scratch.
					</p>
				</div>

				<div class="resource-modules-container">
					{#each resourceModules as module}
						{@const colors = getModuleColors(module.id)}
						<a
							href="/resource/{module.path}"
							class="resource-module-card"
							style="box-shadow: inset 0 1px 10px rgba(255, 255, 255, 0.3), 1px 1px 0 #826D5B;"
							aria-label="Resource Module: {module.title}"
						>
							<!-- Left color bar with module icon (styled as cassette spine) -->
							<div class="module-number-container" style="background-color: {colors.bg};">
								<!-- Cassette tape texture pattern -->
								<div class="tape-texture"></div>

								<!-- Scan line animation (matches retro theme) -->
								<div class="scan-line"></div>

								<!-- Tape icon instead of number -->
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
										<line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#33312E" stroke-width="1.5" />
									</svg>
								</div>
							</div>

							<div class="content-container">
								<!-- Title and description section -->
								<div class="title-description-container">
									<div class="title-description-inner">
										<h3 class="module-title">
											{module.title}
										</h3>

										<!-- Module description -->
										<p class="module-description">
											{module.description}
										</p>
									</div>
								</div>

								<!-- Tape count indicator -->
								<div class="module-meta">
									<div class="tape-count">
										<span class="tapes">{module.tapes} Tapes</span>
									</div>
									<div class="module-badge">
										{module.coreModules}
									</div>
								</div>
							</div>

							<!-- Side tape indicator (subtle design element) -->
							<div
								class="tape-indicator"
								style="background: repeating-linear-gradient(90deg, transparent, transparent 2px, {colors.accent}20 2px, {colors.accent}20 4px);"
							></div>
						</a>
					{/each}
				</div>

				<p class="resource-modules-note">
					These resources are organized to complement specific core modules and provide additional
					foundational practice.
				</p>
			</div>
		</div>

		<!-- Learning Guide Sections -->
		<div id="learning-guide" class="content-section">
			<h2 class="section-title">Why FSI</h2>
			<div class="section-content">
				<p>
					The Foreign Service Institute (FSI) materials are in the public domain, free, and
					exceptionally well-structured. However, these resources are decades old, which makes them
					difficult to access and use effectively. Our platform digitizes and modernizes these
					valuable materials, making them accessible to today's language learners.
				</p>
			</div>
		</div>

		<div class="content-section">
			<h2 class="section-title">Problems with FSI</h2>
			<div class="section-content">
				<p>
					It is old, so it needs to be used to the best of its ability. This will not help you too
					much with speaking and some language is outdated, but language form does not change as
					fast as vocabulary so this is a great resource for practicing listening.
				</p>
				<p>
					One of its biggest weaknesses, over focus on form, can become a strength. This is why I
					did not include the drill tapes. This is also boring so how do we use it?
				</p>
			</div>
		</div>

		<div class="content-section">
			<h2 class="section-title">How to Use This Resource</h2>
			<div class="section-content">
				<p>
					It is called a modular approach because you can pick and choose what you need. The clear
					way is listening to the review tapes then look over vocabulary then try the exercises and
					finally the RWP.
				</p>
				<p>
					But I also recommend going backwards starting with whichever module you need and with the
					exercises or the RWP. Test yourself and if it is easy keep skipping the previous steps as
					they are meant to build you up. However if you find the RWP difficult try the exercises
					and if that is hard then listen to the review and if that is hard try an earlier module.
				</p>
				<p>
					This course is structured really well and if you start from beginning to end you will be
					able to understand a lot of it. And always remember the goal isn't 100% understanding, but
					that you got most of it. Go easy on yourself.
				</p>

				<a href="/resource/more-info" class="info-link">
					More language learning tips and strategies
					<svg class="link-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</a>
			</div>
		</div>
	</section>
</div>

<style>
	/* Page background */
	.page-background {
		min-height: 100vh;
		background-color: #f4f1de;
		padding-bottom: 3rem;
        
	}

	/* Header styling */
	.page-header {
		position: relative;
		margin-bottom: 2.5rem;
		padding-top: 1.5rem;
	}

	.title-container {
		position: relative;
		display: inline-block;
	}

	.page-title {
		font-family: 'Arvo', serif;
		font-size: 2.5rem;
		font-weight: bold;
		color: #33312e;
	}

	.title-underline {
		position: absolute;
		bottom: -0.5rem;
		left: 0;
		height: 0.375rem;
		width: 100%;
		background-color: #ddb967;
	}

	.page-description {
		margin-top: 1.5rem;
		max-width: 42rem;
		font-family: 'Work Sans', sans-serif;
		line-height: 1.625;
		color: #33312e;
		opacity: 0.9;
	}

	.header-buttons {
		display: flex;
		gap: 1rem;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}

	.primary-button,
	.secondary-button {
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		padding: 0.5rem 1.25rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 2px 2px 0 #826d5b;
	}

	.primary-button {
		background-color: #c17c74;
		color: white;
		border: 1px solid #ad6c66;
	}

	.secondary-button {
		background-color: #e8e5d7;
		color: #33312e;
		border: 1px solid #a0998a;
	}

	.primary-button:hover,
	.secondary-button:hover {
		transform: translateY(-0.125rem);
		box-shadow: 3px 3px 0 #826d5b;
	}

	.primary-button:active,
	.secondary-button:active {
		transform: translateY(0.125rem);
		box-shadow: 1px 1px 0 #826d5b;
	}

	.button-arrow {
		margin-left: 0.5rem;
		height: 1rem;
		width: 1rem;
		transition: transform 0.2s;
	}

	.primary-button:hover .button-arrow,
	.secondary-button:hover .button-arrow {
		transform: translateX(0.25rem);
	}

	/* Content sections */
	.content-section {
		margin-top: 2.5rem;
		padding: 1.5rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 0.5rem;
		/* box-shadow: inset 0 1px 5px rgba(255, 255, 255, 0.5); */
		background-image:
			url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E"),
			linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.02));
	}

	.section-title {
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		font-weight: 600;
		color: #33312e;
		margin-bottom: 1rem;
		position: relative;
		padding-bottom: 0.5rem;
	}

	.section-title::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 4rem;
		height: 0.25rem;
		background-color: #ddb967;
	}

	.section-content {
		font-family: 'Work Sans', sans-serif;
		line-height: 1.625;
		color: #33312e;
	}

	.section-content p {
		margin-bottom: 1rem;
	}

	/* Info link */
	.info-link {
		display: inline-flex;
		align-items: center;
		margin-top: 1rem;
		color: #34667f;
		font-weight: 500;
		transition: color 0.2s;
	}

	.info-link:hover {
		color: #c17c74;
	}

	.link-arrow {
		margin-left: 0.25rem;
		height: 1rem;
		width: 1rem;
		transition: transform 0.2s;
	}

	.info-link:hover .link-arrow {
		transform: translateX(0.25rem);
	}

	/* Resource modules warning */
	.resource-module-warning {
		padding: 1rem;
		margin-bottom: 1.5rem;
		background-color: rgba(193, 124, 116, 0.1);
		border-left: 4px solid #c17c74;
		border-radius: 0.25rem;
	}

	/* Resource modules container */
	.resource-modules-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	/* Resource module card styling (based on UnitCard) */
	.resource-module-card {
		position: relative;
		display: flex;
		height: 4rem;
		align-items: center;
		overflow: hidden;
		border-radius: 0.5rem;
		border: 2px solid #33312e;
		background-color: #f4f1de;
		transition: all 0.2s;
	}

	.resource-module-card:hover {
		transform: translateY(-0.25rem);
		box-shadow: 3px 3px 0 #826d5b !important;
	}

	.resource-module-card:focus {
		outline: none;
		box-shadow:
			0 0 0 2px #ddb967,
			0 0 0 4px white;
	}

	/* Module number container */
	.module-number-container {
		position: relative;
		display: flex;
		height: 100%;
		width: 4rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-right: 2px solid #33312e;
	}

	.tape-texture {
		position: absolute;
		inset: 0;
		opacity: 0.1;
		background-image:
			linear-gradient(45deg, #33312e 25%, transparent 25%, transparent 75%, #33312e 75%, #33312e),
			linear-gradient(45deg, #33312e 25%, transparent 25%, transparent 75%, #33312e 75%, #33312e);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
	}

	.scan-line {
		position: absolute;
		top: 0;
		left: 0;
		height: 0.25rem;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		animation: scanDown 3s ease-in-out infinite;
	}

	.tape-icon {
		position: relative;
		z-index: 10;
	}

	/* Content container */
	.content-container {
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: space-between;
		padding-left: 0.75rem;
		padding-right: 0.75rem;
	}

	.title-description-container {
		flex-grow: 1;
		padding-right: 0.5rem;
	}

	.title-description-inner {
		display: flex;
		flex-direction: column;
	}

	.module-title {
		max-width: 200px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-family: 'Arvo', serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
		margin: 0;
	}

	.resource-module-card:hover .module-title {
		color: #c17c74;
	}

	.module-description {
		font-size: 0.75rem;
		color: rgba(51, 49, 46, 0.8);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 200px;
		margin: 0;
	}

	/* Module meta info */
	.module-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
	}

	.tape-count {
		font-size: 0.75rem;
		font-weight: 500;
		color: #33312e;
		opacity: 0.8;
	}

	.module-badge {
		padding: 0.125rem 0.375rem;
		background-color: rgba(51, 49, 46, 0.1);
		border-radius: 0.25rem;
		font-size: 0.625rem;
		font-weight: 500;
		color: #33312e;
		white-space: nowrap;
	}

	/* Tape indicator at bottom */
	.tape-indicator {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 50%;
		height: 2px;
		background-color: rgba(51, 49, 46, 0.1);
	}

	.resource-modules-note {
		margin-top: 1.5rem;
		font-size: 0.875rem;
		color: #33312e;
		opacity: 0.7;
	}

	/* Animations */
	@keyframes scanDown {
		0%,
		100% {
			transform: translateY(-100%);
		}
		50% {
			transform: translateY(100%);
		}
	}

	/* Media queries */
	@media (min-width: 640px) {
		.module-title,
		.module-description {
			max-width: calc(100vw - 20rem);
		}
	}
</style>
