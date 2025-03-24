<!-- src/routes/policies/+page.svelte -->
<script>
	import { onMount } from 'svelte';

	// For contact form
	let name = '';
	let email = '';
	let message = '';
	let submitting = false;
	let submitted = false;
	let error = '';

	// Function to handle form submission
	async function handleSubmit() {
		if (!name || !email || !message) {
			error = 'Please fill out all fields';
			return;
		}

		submitting = true;
		error = '';

		try {
			// This would be replaced with your actual email service
			// For example, using EmailJS, FormSubmit, or a serverless function
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulating API call

			// Clear form and show success message
			name = '';
			email = '';
			message = '';
			submitted = true;
		} catch (err) {
			error = 'Failed to send message. Please try again.';
			console.error('Contact form error:', err);
		} finally {
			submitting = false;
		}
	}

	// Scroll to section if hash is present in URL
	onMount(() => {
		const hash = window.location.hash;
		if (hash) {
			const element = document.querySelector(hash);
			if (element) {
				setTimeout(() => {
					element.scrollIntoView({ behavior: 'smooth' });
				}, 100);
			}
		}
	});
</script>

<svelte:head>
	<title>Policies & Terms | Taped Chinese</title>
	<meta
		name="description"
		content="Terms of service, privacy policy, refund policy, and contact information for Taped Chinese."
	/>
</svelte:head>

<div class="page-background">
	<div class="policies-container">
		<!-- Navigation sidebar -->
		<div class="policies-nav">
			<h2 class="nav-title">Policies</h2>
			<ul class="nav-links">
				<li><a href="#terms">Terms of Service</a></li>
				<li><a href="#privacy">Privacy Policy</a></li>
				<li><a href="#premium">Premium Features</a></li>
				<li><a href="#refunds">Refund Policy</a></li>
				<li><a href="#cancellation">Cancellation Policy</a></li>
				<li><a href="#contact">Contact Us</a></li>
			</ul>

			<div class="nav-decoration">
				<div class="tape-corner top-left"></div>
				<div class="tape-corner top-right"></div>
				<div class="tape-corner bottom-left"></div>
				<div class="tape-corner bottom-right"></div>
			</div>
		</div>

		<!-- Main content -->
		<div class="policies-content">
			<h1 class="page-title">Policies & Terms</h1>
			<div class="title-underline"></div>
			<p class="last-updated">Last updated: {new Date().toLocaleDateString()}</p>

			<!-- Terms of Service -->
			<section id="terms" class="policy-section">
				<h2 class="section-title">Terms of Service</h2>

				<div class="section-content">
					<p>
						Welcome to Taped Chinese. By using our website, you agree to these Terms of Service.
					</p>

					<h3>1. About Our Service</h3>
					<p>
						Taped Chinese is an educational platform that digitizes the Foreign Service Institute's
						"Standard Chinese: A Modular Approach" course materials. We offer both free and premium
						subscription services.
					</p>

					<h3>2. Account Responsibilities</h3>
					<p>
						You are responsible for maintaining the confidentiality of your account information and
						for all activities that occur under your account. You must immediately notify us of any
						unauthorized use of your account.
					</p>

					<h3>3. Acceptable Use</h3>
					<p>You agree not to:</p>
					<ul>
						<li>Use the service for any illegal purpose or in violation of any laws</li>
						<li>Attempt to gain unauthorized access to any part of the service</li>
						<li>Interfere with or disrupt the service or servers</li>
						<li>Scrape or collect data from the service without permission</li>
						<li>Share your account or subscription benefits with others</li>
					</ul>

					<h3>4. Content and Intellectual Property</h3>
					<p>
						The core FSI materials are in the public domain. Our digitized interface, design, and
						additional features (such as RWP exercises) are protected by intellectual property laws.
						You may not reproduce, distribute, modify, or create derivative works based on these
						elements without permission.
					</p>

					<h3>5. User-Generated Content</h3>
					<p>
						By submitting feedback or other content to our site, you grant us a non-exclusive,
						royalty-free license to use, reproduce, and display such content in connection with
						providing and promoting the service.
					</p>

					<h3>6. Subscription Terms</h3>
					<p>
						Premium subscriptions are charged on a recurring basis. You can cancel at any time
						through your account page. For more details, see our Refund and Cancellation policies.
					</p>

					<h3>7. Disclaimer of Warranties</h3>
					<p>
						The service is provided "as is" without warranties of any kind, either express or
						implied. We do not guarantee that the service will be error-free or uninterrupted.
					</p>

					<h3>8. Limitation of Liability</h3>
					<p>
						To the maximum extent permitted by law, Taped Chinese shall not be liable for any
						indirect, incidental, special, consequential, or punitive damages resulting from your
						use or inability to use the service.
					</p>

					<h3>9. Changes to Terms</h3>
					<p>
						We may modify these terms at any time. Continued use of the service after any changes
						indicates your acceptance of the modified terms.
					</p>
				</div>
			</section>

			<!-- Privacy Policy -->
			<section id="privacy" class="policy-section">
				<h2 class="section-title">Privacy Policy</h2>

				<div class="section-content">
					<p>
						Your privacy is important to us. This policy explains how we collect, use, and protect
						your information.
					</p>

					<h3>1. Information We Collect</h3>
					<p>We collect the following information:</p>
					<ul>
						<li>Account information (email, password)</li>
						<li>User preferences (traditional/simplified character settings)</li>
						<li>Learning progress data</li>
						<li>Optional user context for personalized exercises</li>
						<li>Feedback and communications you provide</li>
					</ul>

					<h3>2. How We Use Your Information</h3>
					<p>We use your information to:</p>
					<ul>
						<li>Provide and maintain the service</li>
						<li>Personalize your learning experience</li>
						<li>Process subscriptions and payments</li>
						<li>Communicate with you about the service</li>
						<li>Improve our offerings based on feedback</li>
					</ul>

					<h3>3. Cookies and Tracking</h3>
					<p>
						Our site uses minimal cookies, primarily to store user preferences such as
						simplified/traditional Chinese character selection. We do not use analytics tools to
						track user behavior.
					</p>

					<h3>4. Data Security</h3>
					<p>
						We implement appropriate security measures to protect your personal information.
						However, no method of transmission over the Internet is 100% secure, and we cannot
						guarantee absolute security.
					</p>

					<h3>5. Data Deletion</h3>
					<p>
						When you delete your account, we immediately delete all your personal data. We do not
						maintain a retention period.
					</p>

					<h3>6. Third-Party Services</h3>
					<p>
						We use Stripe for payment processing. Your payment information is handled directly by
						Stripe according to their privacy policy.
					</p>

					<h3>7. International Users</h3>
					<p>
						Our services are operated in the United States. If you are located outside of the United
						States, please be aware that information we collect will be transferred to and processed
						in the United States.
					</p>

					<h3>8. Changes to Privacy Policy</h3>
					<p>
						We may update this privacy policy from time to time. We will notify you of any changes
						by posting the new policy on this page.
					</p>
				</div>
			</section>

			<!-- Premium Features -->
			<section id="premium" class="policy-section">
				<h2 class="section-title">Premium Features</h2>

				<div class="section-content">
					<p>
						Taped Chinese offers premium subscriptions to support the continued development and
						maintenance of this educational resource.
					</p>

					<h3>Subscription Options</h3>
					<div class="premium-options">
						<div class="premium-option">
							<h4>Monthly Premium</h4>
							<p class="price">$5 per month</p>
							<ul class="feature-list">
								<li>Enhanced access to RWP exercises</li>
								<li>Text-to-speech capabilities</li>
								<li>Support the continued development</li>
							</ul>
						</div>

						<div class="premium-option">
							<h4>Annual Premium</h4>
							<p class="price">$45 per year</p>
							<p class="savings">Save $15 compared to monthly plan</p>
							<ul class="feature-list">
								<li>All monthly premium features</li>
								<li>Best value option</li>
							</ul>
						</div>
					</div>

					<h3>Free vs. Premium</h3>
					<p>
						All core FSI course materials will always remain free. Premium subscriptions provide:
					</p>
					<ul>
						<li>
							Increased daily limit for RWP exercise generation (exact limits being determined)
						</li>
						<li>Text-to-speech functionality for learning materials</li>
						<li>Support for ongoing development and server costs</li>
					</ul>

					<p class="premium-note">
						Note: Premium features are being tested and refined during our initial launch phase.
						Exact usage limits will be determined based on server costs and user behavior.
					</p>
				</div>
			</section>

			<!-- Refund Policy -->
			<section id="refunds" class="policy-section">
				<h2 class="section-title">Refund Policy</h2>

				<div class="section-content">
					<p>Our refund policy is designed to be clear and straightforward:</p>

					<h3>Subscription Payments</h3>
					<p>
						Monthly and yearly subscriptions are non-refundable. When you purchase a subscription,
						you agree to pay the recurring charges for the subscription period.
					</p>

					<h3>Exceptional Circumstances</h3>
					<p>
						In exceptional circumstances (such as service unavailability for extended periods),
						refunds may be considered on a case-by-case basis. Please contact us if you believe such
						circumstances apply to your situation.
					</p>

					<h3>Trial Periods</h3>
					<p>
						If we offer a free trial period for premium features, you will not be charged during the
						trial. You can cancel anytime before the trial ends to avoid being charged for the
						subsequent subscription period.
					</p>

					<h3>Errors in Billing</h3>
					<p>
						If you believe you've been charged in error, please contact us immediately. We will
						review your case and make appropriate adjustments if warranted.
					</p>
				</div>
			</section>

			<!-- Cancellation Policy -->
			<section id="cancellation" class="policy-section">
				<h2 class="section-title">Cancellation Policy</h2>

				<div class="section-content">
					<p>You can cancel your subscription at any time through your account page:</p>

					<h3>How to Cancel</h3>
					<ol>
						<li>Log in to your account</li>
						<li>Go to your Profile page</li>
						<li>Navigate to the Account tab</li>
						<li>Click "Manage Subscription"</li>
						<li>Select "Cancel Subscription"</li>
					</ol>

					<h3>Effect of Cancellation</h3>
					<p>When you cancel your subscription:</p>
					<ul>
						<li>Your premium access will continue until the end of your current billing period</li>
						<li>You will not be charged for future billing periods</li>
						<li>
							Your account will automatically revert to free status when the current period ends
						</li>
						<li>You will retain access to all core learning materials</li>
					</ul>

					<h3>Reactivation</h3>
					<p>
						You can reactivate your subscription at any time. If you reactivate during the same
						billing period in which you cancelled, your premium access will simply continue without
						interruption.
					</p>
				</div>
			</section>

			<!-- Contact Form -->
			<section id="contact" class="policy-section">
				<h2 class="section-title">Contact Us</h2>

				<div class="section-content">
					<p>
						If you have any questions about these policies or need assistance with the service,
						please use the contact form below:
					</p>

					{#if !submitted}
						<form class="contact-form" on:submit|preventDefault={handleSubmit}>
							<div class="form-group">
								<label for="name">Name</label>
								<input type="text" id="name" bind:value={name} required />
							</div>

							<div class="form-group">
								<label for="email">Email</label>
								<input type="email" id="email" bind:value={email} required />
							</div>

							<div class="form-group">
								<label for="message">Message</label>
								<textarea id="message" bind:value={message} rows="5" required></textarea>
							</div>

							{#if error}
								<div class="error-message">{error}</div>
							{/if}

							<button type="submit" class="submit-button" disabled={submitting}>
								{submitting ? 'Sending...' : 'Send Message'}
							</button>
						</form>
					{:else}
						<div class="success-message">
							<div class="success-icon">✓</div>
							<h3>Thank You!</h3>
							<p>Your message has been sent. We'll respond as soon as possible.</p>
							<button class="reset-button" on:click={() => (submitted = false)}
								>Send Another Message</button
							>
						</div>
					{/if}

					<div class="response-note">
						<p>
							We strive to respond to all inquiries within 48 hours during normal business days.
						</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>

<style>
	.page-background {
		background-color: #f4f1de;
		background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23a09a8a' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
		min-height: 100vh;
		padding: 2rem 0;
	}

	.policies-container {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 2rem;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1rem;
	}

	/* Sticky sidebar navigation */
	.policies-nav {
		position: sticky;
		top: 2rem;
		height: fit-content;
		background-color: #e8e5d7;
		border: 1px solid #d3cfc4;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
		margin-bottom: 2rem;
		z-index: 10;
		position: relative;
	}

	.nav-title {
		font-family: 'Courier Prime', monospace;
		font-size: 1.25rem;
		font-weight: 700;
		color: #33312e;
		margin-bottom: 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #ddb967;
	}

	.nav-links {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.nav-links li {
		margin-bottom: 0.75rem;
	}

	.nav-links a {
		color: #33312e;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
		display: block;
		padding: 0.5rem;
		border-radius: 4px;
	}

	.nav-links a:hover {
		background-color: rgba(221, 185, 103, 0.2);
		color: #33312e;
	}

	/* Taped corners decoration */
	.nav-decoration {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.tape-corner {
		position: absolute;
		width: 30px;
		height: 30px;
		background-color: rgba(221, 185, 103, 0.5);
		transform: rotate(45deg);
	}

	.top-left {
		top: -8px;
		left: -8px;
	}

	.top-right {
		top: -8px;
		right: -8px;
	}

	.bottom-left {
		bottom: -8px;
		left: -8px;
	}

	.bottom-right {
		bottom: -8px;
		right: -8px;
	}

	/* Main content styles */
	.policies-content {
		background-color: #ffffff;
		border: 1px solid #d3cfc4;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
	}

	.page-title {
		font-family: 'Courier Prime', monospace;
		font-size: 2.25rem;
		font-weight: 700;
		color: #33312e;
		margin-bottom: 0.5rem;
	}

	.title-underline {
		height: 3px;
		width: 100px;
		background-color: #c17c74;
		margin-bottom: 1rem;
	}

	.last-updated {
		font-size: 0.875rem;
		color: #665e4d;
		margin-bottom: 2rem;
		font-style: italic;
	}

	.policy-section {
		margin-bottom: 3rem;
		padding-top: 1rem;
	}

	.section-title {
		font-family: 'Courier Prime', monospace;
		font-size: 1.75rem;
		font-weight: 700;
		color: #33312e;
		margin-bottom: 1.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid #e5e2dd;
	}

	.section-content {
		font-size: 1rem;
		line-height: 1.6;
		color: #4b4945;
	}

	.section-content p {
		margin-bottom: 1.25rem;
	}

	.section-content h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
		margin: 1.5rem 0 0.75rem;
	}

	.section-content ul,
	.section-content ol {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	.section-content li {
		margin-bottom: 0.5rem;
	}

	/* Premium options styling */
	.premium-options {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin: 1.5rem 0;
	}

	.premium-option {
		background-color: #f4f1de;
		border: 1px solid #d3cfc4;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.premium-option h4 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
		margin-bottom: 0.5rem;
	}

	.price {
		font-size: 1.5rem;
		font-weight: 700;
		color: #7d8c5c;
		margin-bottom: 0.5rem;
	}

	.savings {
		font-size: 0.875rem;
		color: #c17c74;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.feature-list {
		list-style-type: none;
		padding-left: 0;
	}

	.feature-list li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.feature-list li:before {
		content: '✓';
		position: absolute;
		left: 0;
		color: #7d8c5c;
		font-weight: bold;
	}

	.premium-note {
		font-size: 0.875rem;
		font-style: italic;
		color: #665e4d;
		padding: 1rem;
		background-color: rgba(221, 185, 103, 0.1);
		border-radius: 4px;
	}

	/* Contact form styling */
	.contact-form {
		background-color: #f4f1de;
		border: 1px solid #d3cfc4;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.25rem;
	}

	.form-group label {
		display: block;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #33312e;
	}

	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #d3cfc4;
		border-radius: 4px;
		background-color: #ffffff;
		font-family: inherit;
		font-size: 1rem;
	}

	.form-group input:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #ddb967;
		box-shadow: 0 0 0 2px rgba(221, 185, 103, 0.2);
	}

	.error-message {
		color: #c17c74;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.submit-button {
		background-color: #7d8c5c;
		color: white;
		font-weight: 600;
		border: none;
		padding: 0.75rem 1.5rem;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.submit-button:hover {
		background-color: #6a774e;
	}

	.submit-button:disabled {
		background-color: #a0a99a;
		cursor: not-allowed;
	}

	/* Success message styling */
	.success-message {
		background-color: #f4f1de;
		border: 1px solid #d3cfc4;
		border-radius: 8px;
		padding: 2rem;
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.success-icon {
		background-color: #7d8c5c;
		color: white;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		margin: 0 auto 1rem;
	}

	.success-message h3 {
		color: #33312e;
		margin-bottom: 0.75rem;
	}

	.reset-button {
		background-color: transparent;
		border: 1px solid #7d8c5c;
		color: #7d8c5c;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 1rem;
		transition: all 0.2s;
	}

	.reset-button:hover {
		background-color: #7d8c5c;
		color: white;
	}

	.response-note {
		font-size: 0.875rem;
		color: #665e4d;
		font-style: italic;
	}

	/* Responsive adjustments */
	@media (max-width: 900px) {
		.policies-container {
			grid-template-columns: 1fr;
		}

		.policies-nav {
			position: static;
			margin-bottom: 2rem;
		}

		.nav-links {
			display: flex;
			flex-wrap: wrap;
			gap: 0.5rem;
		}

		.nav-links li {
			margin-bottom: 0;
		}

		.premium-options {
			grid-template-columns: 1fr;
		}
	}
</style>
