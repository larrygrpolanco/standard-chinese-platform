<!-- src/routes/resource/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import ResourceModuleCard from '$lib/components/ResourceModuleCard.svelte';

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
		<!-- Header content remains the same -->
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
				<!-- <a href="/modules" class="primary-button">
					Get Started
					<svg class="button-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</a> -->
				<!-- Changed from button to anchor linking to more-info page -->
				<a href="/resource/more-info" class="secondary-button">
					A Deeper Look
					<svg class="button-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</a>
			</div>
		</header>

		<!-- Resource Modules Section -->
		<div class="content-section">
			<h2 class="section-title">Resource Modules</h2>
			<div class="section-content">
				<div class="resource-modules-container">
					{#each resourceModules as module}
						<ResourceModuleCard {module} />
					{/each}
				</div>

				<p class="resource-modules-note">
					These resources are organized to complement specific core modules and provide additional
					foundational practice.
				</p>

				<div class="resource-module-warning">
					<p>
						<strong>Note:</strong> This course will not be easy for complete beginners as it was made
						to be used along with classroom learning. The resource module tapes above cover a lot of
						the basics, but they are dense, repetive, and possibly soul crushingly boring.
					</p>
				</div>
			</div>
		</div>

		<!-- Learning Guide Sections -->
		<div id="learning-guide" class="content-section">
			<h2 class="section-title">Why FSI</h2>
			<div class="section-content">
				<p>
					The Foreign Service Institute (FSI) materials are in the public domain, free, and
					exceptionally well-structured. However, these resources are decades old, which makes them
					difficult to access and use effectively. This platform digitizes and modernizes these
					materials, making them more accessible to learners.
				</p>
			</div>
		</div>

		<div class="content-section">
			<h2 class="section-title">Problems with FSI</h2>
			<div class="section-content">
				<p>
					It is old, you will learn the Chinese word for comrade. It needs to be used to the best of
					its ability. FSI Standard Chinese is great for practicing listening, vocabulary and
					grammar. This resource alone will not help you too much with speaking skills, but
					improving your listening is vital to being able to respond.
				</p>
				<p>
					One of its biggest weaknesses is an overfocus on form. FSI courses are famous for their
					drills and their tedium. Most modern language courses do not have hours of drills anymore
					for a good reason. The drill tapes were not added to this website. These weaknesses can
					become a strength if used as a supplement to learning parts of the language. So how do we
					best use this resource?
				</p>
			</div>
		</div>

		<div class="content-section">
			<h2 class="section-title">How to Use This Resource</h2>
			<div class="section-content">
				<p>
					It is called a modular approach because you can pick and choose what you need. The
					straightforward way is to go through each unit starting from first to last, listening to
					the two review tapes for each unit, then complete the exercise tapes and questions.
				</p>
				<p>
					But I also recommend starting with whichever module you need and with the exercises or the
					RWP. Test yourself and if it is easy keep following the study flow that works for you.
					However if you find the RWP difficult, then try the exercises and if that is hard, then
					listen to the review, and if it still isn't clicking, try going back to an earlier unit.
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
	/* Keep the resource modules container styles */
	.resource-modules-container {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.resource-modules-note {
		margin-top: 1.5rem;
		font-size: 0.875rem;
		color: #33312e;
		opacity: 0.7;
	}

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
		padding-top: 1rem;
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

	/* .primary-button, */
	.secondary-button {
		display: inline-flex;
		align-items: center;
		border-radius: 9999px;
		padding: 0.5rem 1.25rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 2px 2px 0 #826d5b;
	}

	/* .primary-button {
		background-color: #c17c74;
		color: white;
		border: 1px solid #ad6c66;
	} */

	.secondary-button {
		background-color: #e8e5d7;
		color: #33312e;
		border: 1px solid #a0998a;
	}

	/* .primary-button:hover, */
	.secondary-button:hover {
		transform: translateY(-0.125rem);
		box-shadow: 3px 3px 0 #826d5b;
	}

	/* .primary-button:active, */
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

	/* .primary-button:hover .button-arrow, */
	.secondary-button:hover .button-arrow {
		transform: translateX(0.25rem);
	}

	/* Content sections */
	.content-section {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: #ede9d7;
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
		margin-top: 0;
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

	/* Resource modules warning */
	.resource-module-warning {
		padding: 0.5rem 1rem;
		margin: 0.5rem;
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

	.resource-modules-note {
		margin-top: 1.5rem;
		font-size: 0.875rem;
		color: #33312e;
		opacity: 0.7;
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
</style>
