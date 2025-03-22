<!-- src/lib/components/profile/AccountTab.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { supabase } from '$lib/supabase/client';
	import ConfirmationModal from '$lib/components/UI/ConfirmationModal.svelte';

	export let user;
	export let userPreferences;

	const dispatch = createEventDispatcher();

	let changePasswordVisible = false;
	let oldPassword = '';
	let newPassword = '';
	let confirmPassword = '';
	let passwordError = '';
	let changing = false;

	let deleteAccountVisible = false;
	let deleteConfirmText = '';
	let deleting = false;

	// Subscription info - this would be retrieved from your actual subscription service
	// For now, we'll simulate it based on fake data
	let subscriptionInfo = {
		status: 'yearly', // 'free', 'monthly', 'yearly'
		nextBillingDate: null,
		// This would come from your Stripe integration
		managementUrl: null
	};

	// Toast helper function
	function showToast(message, type = 'success') {
		dispatch('toast', { message, type });
	}

	async function handleChangePassword() {
		if (newPassword !== confirmPassword) {
			passwordError = 'Passwords do not match';
			return;
		}

		if (newPassword.length < 6) {
			passwordError = 'Password must be at least 6 characters';
			return;
		}

		changing = true;
		passwordError = '';

		try {
			// Supabase requires current password for security
			const { error } = await supabase.auth.updateUser({
				password: newPassword
			});

			if (error) throw error;

			// Clear form
			oldPassword = '';
			newPassword = '';
			confirmPassword = '';
			changePasswordVisible = false;
			showToast('Password changed successfully');
		} catch (error) {
			console.error('Error changing password:', error);
			passwordError = error.message || 'Failed to change password';
			showToast('Failed to change password', 'error');
		} finally {
			changing = false;
		}
	}

	async function handleDeleteAccount() {
		if (deleteConfirmText !== 'DELETE') {
			showToast('Please type DELETE to confirm account deletion', 'error');
			return;
		}

		deleting = true;

		try {
			// First we should delete all user data from the database
			// This could be a call to a server function that handles all deletion
			// For simplicity, I'm showing just the auth deletion here

			// Delete the user account
			const { error } = await supabase.auth.admin.deleteUser(user.id);
			if (error) throw error;

			// Sign out
			await authStore.signOut();
			showToast('Your account has been deleted', 'success');

			// Redirect to home page
			window.location.href = '/';
		} catch (error) {
			console.error('Error deleting account:', error);
			showToast('Failed to delete account: ' + error.message, 'error');
			deleting = false;
		}
	}

	// Reset password fields when hiding the form
	function cancelPasswordChange() {
		oldPassword = '';
		newPassword = '';
		confirmPassword = '';
		passwordError = '';
		changePasswordVisible = false;
	}
</script>

<div class="account-tab">
	<!-- I don't think it is doing much now I may edit this later -->
	<!-- <section class="account-section">
		<h2 class="section-title">Account Information</h2>
		<div class="info-grid">
			<div class="info-item">
				<span class="info-label">Email</span>
				<span class="info-value">{user.email}</span>
			</div>
			{#if user.last_sign_in_at}
				<div class="info-item">
					<span class="info-label">Last Sign In</span>
					<span class="info-value">{new Date(user.last_sign_in_at).toLocaleString()}</span>
				</div>
			{/if}
			<div class="info-item">
				<span class="info-label">Account Created</span>
				<span class="info-value">{new Date(user.created_at).toLocaleString()}</span>
			</div>
		</div>
	</section> -->

	<section class="account-section">
		<h2 class="section-title">Subscription</h2>
		<div class="subscription-message">
			RWP features completely free during this prototyping phase
		</div>
		<div class="subscription-card">
			<div class="sub-status">
				<span class="sub-status-label">Current Plan:</span>
				<span class="sub-status-value {subscriptionInfo.status}">
					{subscriptionInfo.status === 'free'
						? 'Free Tier'
						: subscriptionInfo.status === 'monthly'
							? 'Monthly Premium'
							: 'Yearly Premium'}
				</span>
			</div>

			{#if subscriptionInfo.status !== 'free' && subscriptionInfo.nextBillingDate}
				<div class="sub-details">
					<span class="sub-label">Next billing date:</span>
					<span class="sub-value"
						>{new Date(subscriptionInfo.nextBillingDate).toLocaleDateString()}</span
					>
				</div>
			{/if}

			<div class="sub-features">
				<h3 class="sub-features-title">Plan Features:</h3>
				<ul class="features-list">
					{#if subscriptionInfo.status === 'free'}
						<li class="feature">Access to all FSI course materials</li>
						<li class="feature">Limited to 1 RWP exercise generation per day</li>
						<li class="feature-upgrade">
							Upgrade to Premium for unlimited RWP exercises and to support this site
						</li>
					{:else}
						<li class="feature">Access to all FSI course materials</li>
						<li class="feature">Unlimited RWP exercise generation</li>
						<li class="feature">Priority support</li>
						<li class="feature">Early access to new features</li>
					{/if}
				</ul>
			</div>

			<div class="sub-actions">
				{#if subscriptionInfo.status === 'free'}
					<button class="tape-button upgrade">Upgrade to Premium</button>
				{:else}
					<button class="tape-button manage">Manage Subscription</button>
				{/if}
			</div>
		</div>

		{#if subscriptionInfo.status === 'free'}
			<div class="subscription-message">
				Your subscription helps support the continued development of this site and keeps all the
				core material free for everyone.
			</div>
		{/if}
	</section>

	<section class="account-section">
		<!-- <h2 class="section-title">Passoword Managment</h2> -->
		<div class="flex-row gap-2 my-2">
			<button class="tape-button danger" on:click={() => dispatch('signOut')}> Sign Out </button>

			{#if !changePasswordVisible}
				<button class="tape-button secondary" on:click={() => (changePasswordVisible = true)}>
					Change Password
				</button>
			{:else}
				<div class="password-form">
					<div class="form-group">
						<label for="newPassword">New Password</label>
						<input
							type="password"
							id="newPassword"
							class="form-input"
							bind:value={newPassword}
							placeholder="Enter new password"
						/>
					</div>

					<div class="form-group">
						<label for="confirmPassword">Confirm New Password</label>
						<input
							type="password"
							id="confirmPassword"
							class="form-input"
							bind:value={confirmPassword}
							placeholder="Confirm new password"
						/>
					</div>

					{#if passwordError}
						<div class="error-message">{passwordError}</div>
					{/if}

					<div class="form-actions">
						<button
							class="tape-button secondary"
							on:click={cancelPasswordChange}
							disabled={changing}
						>
							Cancel
						</button>
						<button
							class="tape-button"
							on:click={handleChangePassword}
							disabled={changing || !newPassword || !confirmPassword}
						>
							{changing ? 'Changing...' : 'Save New Password'}
						</button>
					</div>
				</div>
			{/if}
		</div>
	</section>

	<section class="account-section danger-section">
		<h2 class="section-title">Delete Account</h2>
		<p class="danger-text">
			Deleting your account will permanently remove all your data, including saved preferences,
			personal context, and generated exercises.
		</p>
		<button class="tape-button danger" on:click={() => (deleteAccountVisible = true)}>
			Delete Account
		</button>
	</section>
</div>

<!-- Delete Account Confirmation Modal -->
{#if deleteAccountVisible}
	<ConfirmationModal
		title="Delete Account"
		confirmButtonText="Delete Permanently"
		cancelButtonText="Cancel"
		isDanger={true}
		on:confirm={handleDeleteAccount}
		on:cancel={() => {
			deleteAccountVisible = false;
			deleteConfirmText = '';
		}}
		loading={deleting}
	>
		<p>
			This action <strong>cannot</strong> be undone. All your data will be permanently deleted.
		</p>
		<p>Please type <strong>DELETE</strong> to confirm:</p>
		<input
			type="text"
			class="form-input"
			bind:value={deleteConfirmText}
			placeholder="Type DELETE"
		/>
	</ConfirmationModal>
{/if}

<style>
	.account-tab {
		padding: 1.5rem;
		/* background-color: var(--color-cream-dark); */
		box-shadow:
			inset 0 1px 4px rgba(51, 49, 46, 0.15),
			4px 4px 0 var(--color-shadow);
		overflow: hidden;
		background-image:
			radial-gradient(circle at 15% 50%, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 85% 30%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
	}

	.account-section {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid #e8e5d7;
	}

	.section-title {
		margin-bottom: 1.25rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}

	.info-item {
		display: flex;
		flex-direction: column;
		padding: 0.75rem;
		background-color: #e8e5d7;
		border-radius: 8px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
	}

	.subscription-card {
		padding: 1.25rem;
		background-color: #e8e5d7;
		border: 1px solid #a0998a;
		border-radius: 8px;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
		margin-bottom: 1rem;
	}

	.sub-status-value {
		padding: 0.25rem 0.75rem;
		border-radius: 16px;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.sub-status-value.free {
		background-color: #a0998a;
		color: #f4f1de;
	}

	.sub-status-value.monthly,
	.sub-status-value.yearly {
		background-color: #ddb967;
		color: #33312e;
	}

	/* Updated form elements styling */
	.form-input {
		width: 100%;
		padding: 0.75rem;
		background-color: #f4f1de;
		border: 1px solid #a0998a;
		border-radius: 8px;
		font-family: 'Work Sans', sans-serif;
		color: #33312e;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
	}

	/* Updated button classes to match the style guide */
	.tape-button {
		/* width: 100%; */
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		font-family: 'Work Sans', sans-serif;
		font-weight: 600;
		color: #33312e;
		background-color: #ddb967;
		border: none;
		border-radius: 16px;
		box-shadow: 0 2px 0 #826d5b;
		transition: all 0.2s;
		cursor: pointer;
	}

	.tape-button:hover:not(:disabled) {
		background-color: #c9a75f;
	}

	.tape-button:active:not(:disabled) {
		transform: translateY(2px);
		box-shadow: 0 0 0 #826d5b;
	}

	.tape-button.secondary {
		background-color: var(--color-cream-paper);
		color: #33312e;
	}

	.tape-button.danger {
		background-color: #c17c74;
		color: #f4f1de;
	}

	.tape-button.upgrade {
		background-color: #ddb967;
		color: #33312e;
	}

	.tape-button:hover {
		filter: brightness(0.95);
	}

	.tape-button:active {
		transform: translateY(2px);
		box-shadow: 0 0 0 rgba(0, 0, 0, 0.1);
	}

	.tape-button:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.tape-button.manage {
		background-color: #a0998a;
	}

	.danger-section {
		background-color: #f9f0ed;
		padding: 1.25rem;
		border-radius: 8px;
		border-left: 3px solid #c17c74;
	}

	.sub-details {
		margin-bottom: 1rem;
	}

	.sub-label {
		color: #70594a;
		margin-right: 0.5rem;
	}

	.sub-value {
		font-weight: 500;
		color: #33312e;
	}

	.sub-features {
		margin-bottom: 1.25rem;
	}

	.sub-features-title {
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #33312e;
	}

	.features-list {
		padding-left: 1.5rem;
	}

	.feature {
		margin-bottom: 0.25rem;
		color: #33312e;
	}

	.feature-upgrade {
		margin-top: 0.5rem;
		font-weight: 500;
		color: #826d5b;
	}

	.sub-actions {
		margin-top: 1rem;
	}

	.subscription-message {
		font-size: 0.875rem;
		font-style: italic;
		color: #70594a;
		text-align: center;
		margin-top: 0.5rem;
	}

	.password-form {
		padding: 1rem;
		background-color: #e8e5d7;
		border-radius: 0.5rem;
		margin-top: 0.5rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: #33312e;
	}

	.error-message {
		color: #c17c74;
		font-size: 0.875rem;
		margin-bottom: 1rem;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
	}

	.danger-section {
		background-color: #f9f0ed;
		padding: 1.25rem;
		border-radius: 0.5rem;
		border-left: 3px solid #c17c74;
	}

	.danger-text {
		margin-bottom: 1rem;
		color: #70594a;
	}

	@media (max-width: 640px) {
		.account-tab {
			padding: 1rem;
		}

		.info-grid {
			grid-template-columns: 1fr;
		}

		.form-actions {
			flex-direction: column;
		}

		.form-actions button {
			width: 100%;
			margin-bottom: 0.5rem;
		}
	}
</style>
