<!-- src/routes/rwp/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';



	function handleDemoClick() {
		goto('/rwp/27');
	}
</script>

<svelte:head>
	<title>Relevant World Practice | Taped Chinese</title>
	<meta
		name="description"
		content="Personalized Chinese language practice that connects to your real world context"
	/>
</svelte:head>

<!-- Subtle paper texture background -->
<div class="page-background">
	<section class="container mx-auto px-4">
		<!-- Header content -->
		<header class="page-header">
			<!-- Title with retro underline -->
			<div class="title-container">
				<h1 class="page-title">Relevant World Practice</h1>
				<div class="title-underline"></div>
			</div>

			<p class="page-description">
				Practice Chinese in contexts that matter to you personally. RWP exercises connects what
				you're learning to your relevant-world experiences, making language study more relevant,
				effective, and hopefully fun.
			</p>

			<div class="header-buttons">

				<button on:click={handleDemoClick} class="secondary-button">
					Try it out
					<svg class="button-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M14 5l7 7m0 0l-7 7m7-7H3"
						/>
					</svg>
				</button>
			</div>
		</header>

		<!-- What is RWP Section -->
		<div class="content-section">
			<h2 class="section-title">What is RWP?</h2>
			<div class="section-content">
				<p>
					<strong>Relevant World Practice (RWP)</strong> tries to improve on one of the biggest issues
					with the FSI course by creating personalized reading and listening exercises that connect directly
					to your life and interests.
				</p>
				<p>
					RWPs are generated first person narrative stories with multiple choice, short answer, and
					reflection questions based around each unit and <em>your</em> context - your job, hobbies,
					goals, and experience.
				</p>
				<p>
					The hope is to make learning more engaging by allowing you to control over how you use and
					practice the things you learn.
				</p>
			</div>
		</div>

		<!-- How it Works Section -->
		<div class="content-section">
			<h2 class="section-title">How RWP Works</h2>
			<div class="section-content">
				<div class="step-card">
					<div class="step-number">1</div>
					<h3 class="step-title">Breaks down the unit</h3>
					<p>RWP takes vocabulary and grammar patterns from the unit you're studying</p>
				</div>

				<div class="step-card">
					<div class="step-number">2</div>
					<h3 class="step-title">Makes connections</h3>
					<p>
						It finds overlap with what you've written your profile and survey questions to create
						scenarios and stories more relevant to your life
					</p>
				</div>

				<div class="step-card">
					<div class="step-number">3</div>
					<h3 class="step-title">Personalized practice</h3>
					<p>
						A custom reading and listening passage with comprehension questions that tries to use
						unit vocabulary and grammar in contexts meaningful to you
					</p>
				</div>

				<div class="profile-reminder">
					<h3>Make Your Practice More Relevant</h3>
					<p>
						Make sure to complete your profile information and the surveys for each module. This
						helps RWP create more personalized content.
					</p>
					<p>You can even create a fictional character instead to learn chinese through!</p>

				</div>
			</div>
		</div>

		<!-- Try it Out Section -->
		<div class="content-section">
			<h2 class="section-title">Try out RWP</h2>
			<div class="section-content">
				<p>
					Check it out with this demo based on the most important langauge learning topic, food
					shoping. See how Dracula might learn how to use chinese to buy food at Taiwanese night
					markets.
				</p>

				<div class="cta-container">


					<button on:click={handleDemoClick} class="secondary-button">
						Try The Demo
						<svg class="button-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M14 5l7 7m0 0l-7 7m7-7H3"
							/>
						</svg>
					</button>
				</div>

				<div class="beta-note">
					<p>
						<strong>Note:</strong> RWP is still being improved on. While it works well most of the time,
						you may occasionally need to regenerate an exercise if there are issues.
					</p>
				</div>
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

	.secondary-button:hover {
		transform: translateY(-0.125rem);
		box-shadow: 3px 3px 0 #826d5b;
	}

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

	.secondary-button:hover .button-arrow {
		transform: translateX(0.25rem);
	}

	/* .large-button {
		padding: 0.75rem 1.5rem;
		font-size: 1.1rem;
	} */

	/* Content sections */
	.content-section {
		margin-top: 2rem;
		padding: 1.5rem;
		background-color: #ede9d7;
		border: 1px solid #a0998a;
		border-radius: 0.5rem;
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

	/* Step cards */
	.step-card {
		position: relative;
		background-color: #f2efe5;
		/* background-color: #f6f3e6; */
		border: 1px solid #a0998a;
		border-radius: 0.5rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
		padding-top: 2rem;
	}

	.step-number {
		position: absolute;
		top: -12px;
		left: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		background-color: #c17c74;
		color: white;
		font-weight: bold;
		border-radius: 50%;
	}

	.step-title {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: #33312e;
	}

	/* Profile reminder */
	.profile-reminder {
		background-color: rgba(52, 102, 127, 0.1);
		border-left: 4px solid #34667f;
		border-radius: 0.25rem;
		padding: 1rem;
		margin-top: 1.5rem;
	}

	.profile-reminder h3 {
		font-family: 'Arvo', serif;
		font-size: 1.1rem;
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: #34667f;
	}

	/* CTA Container */
	.cta-container {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 1.5rem 0;
	}

	@media (min-width: 640px) {
		.cta-container {
			flex-direction: row;
		}
	}

	/* Beta and support notes */
	.beta-note {
		background-color: rgba(221, 185, 103, 0.15);
		border-left: 4px solid #ddb967;
		border-radius: 0.25rem;
		padding: 1rem;
		padding-bottom: 0.25rem;
	}

	/* .support-note {
		background-color: rgba(193, 124, 116, 0.1);
		border-left: 4px solid #c17c74;
		border-radius: 0.25rem;
		padding: 1rem;
	} */


</style>
