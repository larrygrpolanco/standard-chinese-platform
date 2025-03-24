<!-- src/routes/legal/+page.svelte -->
<script>
	import { onMount } from 'svelte';

	// For smooth scrolling to anchors
	onMount(() => {
		// Check if there's a hash in the URL
		if (window.location.hash) {
			const id = window.location.hash.substring(1);
			const element = document.getElementById(id);
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' });
			}
		}

		// Add smooth scrolling for all anchor links
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener('click', function (e) {
				e.preventDefault();
				const id = this.getAttribute('href').substring(1);
				const element = document.getElementById(id);
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' });
					// Update URL without page reload
					history.pushState(null, null, `#${id}`);
				}
			});
		});
	});
</script>

<svelte:head>
	<title>Legal Policies | Taped Chinese</title>
	<meta
		name="description"
		content="Terms of Service, Privacy, Refund and Cancellation policies for Taped Chinese."
	/>
</svelte:head>

<div class="page-background">
	<div class="container mx-auto max-w-4xl px-4 py-8">
		<header class="mb-8">
			<h1 class="page-title">Legal Policies</h1>
			<div class="title-underline-gold"></div>
			<p class="page-description">
				The following policies govern your use of Taped Chinese. These policies are designed to be
				clear and straightforward.
			</p>
		</header>

		<!-- Table of Contents -->
		<div class="policy-toc">
			<h2>Quick Navigation</h2>
			<ul>
				<li><a href="#terms">Terms of Service</a></li>
				<li><a href="#privacy">Privacy Policy</a></li>
				<li><a href="#subscription">Subscription Policy</a></li>
				<li><a href="#refund">Refund Policy</a></li>
				<li><a href="#cancellation">Cancellation Policy</a></li>
			</ul>
		</div>

		<!-- Terms of Service -->
		<section id="terms" class="policy-section">
			<h2>Terms of Service</h2>
            <div class="title-underline-gold"></div>

			<div class="policy-content">
				<h3>1. Introduction</h3>
				<div class="title-underline"></div>
				<p>
					Taped Chinese is a hobby project created to digitize and modernize the Foreign Service
					Institute's "Standard Chinese: A Modular Approach" course materials. By using this
					website, you agree to these Terms of Service.
				</p>

				<h3>2. Account Terms</h3>
				<div class="title-underline"></div>
				<p>
					When you create an account, you are responsible for maintaining the security of your
					account and the activities that occur under your account. You must provide accurate
					information when creating an account.
				</p>

				<h3>3. Core Service</h3>
				<div class="title-underline"></div>
				<p>
					The core FSI materials on this website will always remain free and accessible to all
					users. These materials are in the public domain.
				</p>

				<h3>4. Premium Features</h3>
				<div class="title-underline"></div>
				<p>
					Premium features, including expanded access to Relevant World Practice (RWP) exercises,
					are available through a paid subscription. Premium features have reasonable usage limits
					to prevent system abuse.
				</p>

				<h3>5. Acceptable Use</h3>
				<div class="title-underline"></div>
				<p>You agree not to:</p>
				<ul>
					<li>Use the service for any illegal purpose</li>
					<li>Attempt to circumvent any access restrictions</li>
					<li>Scrape or download materials in bulk</li>
					<li>Share your account credentials with others</li>
					<li>Interfere with the proper functioning of the website</li>
				</ul>

				<h3>6. Intellectual Property</h3>
				<div class="title-underline"></div>
				<p>
					The FSI materials are in the public domain. The website design, layout, and any
					enhancements to the original materials (including RWP functionality) are intellectual
					property of Taped Chinese.
				</p>

				<h3>7. Limitation of Liability</h3>
				<div class="title-underline"></div>
				<p>
					Taped Chinese is provided "as is" without warranty of any kind. In no event shall the
					creator be liable for any damages arising from the use or inability to use this service.
				</p>

				<h3>8. Modifications to Service</h3>
				<div class="title-underline"></div>
				<p>
					We reserve the right to modify or discontinue the service temporarily or permanently with
					or without notice. We will strive to communicate any significant changes in advance.
				</p>

				<h3>9. Governing Law</h3>
				<div class="title-underline"></div>
				<p>
					These Terms shall be governed by and construed in accordance with the laws of the
					jurisdiction in which the creator resides, without regard to its conflict of law
					provisions.
				</p>
			</div>
		</section>

		<!-- Privacy Policy -->
		<section id="privacy" class="policy-section">
			<h2>Privacy Policy</h2>
			<div class="title-underline-gold"></div>

			<div class="policy-content">
				<h3>1. Data Collection</h3>
				<div class="title-underline"></div>
				<p>We collect only the information you actively provide:</p>
				<ul>
					<li>Email address and password for account registration</li>
					<li>Learning preferences you choose to share</li>
					<li>Context information you provide for personalized exercises</li>
					<li>Feedback you choose to submit</li>
				</ul>

				<h3>2. How We Use Your Data</h3>
                <div class="title-underline"></div>

				<p>Your data is used exclusively for:</p>
				<ul>
					<li>Authenticating your account access</li>
					<li>Personalizing your learning experience</li>
					<li>Creating relevant RWP exercises based on your context</li>
					<li>Processing subscription payments (if applicable)</li>
					<li>Improving the learning platform</li>
				</ul>

				<h3>3. Data Storage</h3>
                <div class="title-underline"></div>
				<p>
					User data is stored on Supabase, a secure database platform. We implement appropriate
					security measures to protect your data.
				</p>

				<h3>4. Data Sharing</h3>
                <div class="title-underline"></div>
				<p>We do not sell or share your personal information with third parties except:</p>
				<ul>
					<li>With Stripe for payment processing (if you subscribe)</li>
					<li>When required by law</li>
				</ul>

				<h3>5. Data Retention and Deletion</h3>
                <div class="title-underline"></div>
				<p>
					When you delete your account, all of your personal data is permanently removed from our
					systems. You can request data deletion at any time.
				</p>

				<h3>6. Cookies and Analytics</h3>
                <div class="title-underline"></div>
				<p>
					We use essential cookies for authentication and site functionality. We may use basic
					analytics to understand usage patterns, but we minimize data collection.
				</p>
			</div>
		</section>

		<!-- Subscription Policy -->
		<section id="subscription" class="policy-section">
			<h2>Subscription Policy</h2>
            <div class="title-underline-gold"></div>

			<div class="policy-content">
				<h3>1. Subscription Service</h3>
                <div class="title-underline"></div>
				<p>Taped Chinese offers a premium subscription for $5 per month, which provides:</p>
				<ul>
					<li>Increased daily limit of Relevant World Practice (RWP) exercises</li>
					<li>Support for maintaining and improving the platform</li>
				</ul>

				<h3>2. Free vs. Premium</h3>
                <div class="title-underline"></div>
				<p>
					All core FSI materials will always remain freely accessible. The premium subscription is
					primarily a way to support the project while gaining additional convenience.
				</p>

				<h3>3. Usage Limits</h3>
                <div class="title-underline"></div>
				<p>
					Free users have access to a limited number of RWP exercises. Premium subscribers can
					generate up to 10 RWP exercises per day, which is designed to be more than sufficient for
					normal use while preventing system abuse.
				</p>

				<h3>4. Billing Cycle</h3>
                <div class="title-underline"></div>
				<p>
					Subscriptions are billed monthly or yearly (depending on your selection) and renew
					automatically until cancelled.
				</p>

				<h3>5. Payment Processing</h3>
                <div class="title-underline"></div>
				<p>
					Payments are securely processed through Stripe. We do not store your full credit card
					information on our servers.
				</p>
			</div>
		</section>

		<!-- Refund Policy -->
		<section id="refund" class="policy-section">
			<h2>Refund Policy</h2>
            <div class="title-underline-gold"></div>

			<div class="policy-content">
				<h3>1. No-Refund Policy</h3>
                <div class="title-underline"></div>
				<p>
					Subscriptions to Taped Chinese are non-refundable. This straightforward policy helps keep
					subscription costs low and administrative overhead minimal.
				</p>

				<h3>2. Subscription Value</h3>
                <div class="title-underline"></div>
				<p>
					The $5 monthly subscription is designed primarily as a way to support this educational
					resource while receiving additional convenience benefits.
				</p>

				<h3>3. Free Trial</h3>
                <div class="title-underline"></div>
				<p>
					We encourage users to explore the free tier before subscribing to ensure the premium
					features meet their needs.
				</p>

				<h3>4. Exceptions</h3>
                <div class="title-underline"></div>
				<p>
					In the case of prolonged service outages or technical issues that substantially prevent
					access to premium features, please contact us through the contact form to discuss
					potential adjustments to your billing.
				</p>
			</div>
		</section>

		<!-- Cancellation Policy -->
		<section id="cancellation" class="policy-section">
			<h2>Cancellation Policy</h2>
            <div class="title-underline-gold"></div>

			<div class="policy-content">
				<h3>1. How to Cancel</h3>
                <div class="title-underline"></div>
				<p>
					You can cancel your subscription at any time through your account settings page. The
					cancellation process is designed to be simple and straightforward with a single-click
					option.
				</p>

				<h3>2. Effect of Cancellation</h3>
                <div class="title-underline"></div>
				<p>
					After cancellation, your premium access will continue until the end of your current
					billing period. You will not be charged again after cancellation.
				</p>

				<h3>3. Account Access After Cancellation</h3>
                <div class="title-underline"></div>
				<p>
					After your premium subscription ends, your account will automatically revert to the free
					tier. You'll still have full access to all core FSI materials and limited access to RWP
					exercises.
				</p>

				<h3>4. Data Retention</h3>
                <div class="title-underline"></div>
				<p>
					Cancelling your subscription does not delete your account or learning data. If you wish to
					completely delete your data, you can do so through the account settings page.
				</p>
			</div>
		</section>

		<div class="policy-footer">
			<p>Last updated: {new Date().toLocaleDateString()}</p>
			<p>
				If you have any questions about these policies, please <a href="/contact">contact us</a>.
			</p>
		</div>
	</div>
</div>

<style>
	.page-background {
		background-color: #f4f1de;
		min-height: 100vh;
		padding: 2rem 0;
	}

	.page-title {
		font-family: 'Courier Prime', monospace;
		font-size: 2.5rem;
		font-weight: 700;
		color: #33312e;
		margin-bottom: 0.5rem;
	}

	.title-underline-gold {
		bottom: -0.5rem;
		left: 0;
		height: 0.375rem;
		width: 100%;
		background-color: #ddb967;
	}

	.title-underline {
		height: 3px;
		width: 100px;
		background-color: #34667f;
		margin-bottom: 1.5rem;
	}

	.page-description {
		font-size: 1.25rem;
		color: #4b4945;
		max-width: 700px;
		line-height: 1.6;
		margin-bottom: 2rem;
	}

	.policy-toc {
		background-color: rgba(255, 255, 255, 0.5);
		border: 1px solid #e5e2dd;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 2.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.policy-toc h2 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #33312e;
	}

	.policy-toc ul {
		list-style-type: none;
		padding: 0;
	}

	.policy-toc li {
		margin-bottom: 0.5rem;
	}

	.policy-toc a {
		color: #34667f;
		text-decoration: none;
		font-weight: 500;
		transition: color 0.2s;
		display: inline-block;
		padding: 0.25rem 0;
	}

	.policy-toc a:hover {
		color: #c17c74;
		text-decoration: underline;
	}
</style>
