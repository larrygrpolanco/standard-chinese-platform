<!-- src/lib/components/profile/AccountTab.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	import { authStore } from '$lib/stores/authStore';
	import { supabase, deleteUserAccount } from '$lib/supabase/client';
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
		if (deleteConfirmText !== 'delete') {
			showToast('Please type delete to confirm account deletion', 'error');
			return;
		}

		deleting = true;

		try {
			// Delete user account using our helper function
			await deleteUserAccount();

			showToast('Your account has been deleted', 'success');

			// Redirect to home page
			window.location.href = '/';
		} catch (error) {
			console.error('Error deleting account:', error);
			showToast('Failed to delete account: ' + error.message, 'error');
		} finally {
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
	<!-- Profile Reminder -->
	<div class="profile-reminder">
		<h3>Make Your Practice More Relevant</h3>
		<p>Make sure to edit your <b>Learning Profile</b> for better RWP quizzes.</p>
		<p><em>Also try creating a fictional character instead to learn chinese through!</em></p>
	</div>

	<!-- Account Information Section -->
	<section class="account-section">
		<h2 class="section-title">Account Information</h2>
		<div class="info-grid">
			<div class="info-item">
				<span class="info-label">Email</span>
				<span class="info-value">{user.email}</span>
			</div>

			<div class="info-item">
				<span class="info-label">Account Created</span>
				<span class="info-value">{new Date(user.created_at).toLocaleDateString()}</span>
			</div>
		</div>
	</section>

	<!-- Account Actions Section -->
	<section class="account-section">
		<h2 class="section-title">Account Management</h2>

		<!-- Session Management -->
		<div class="management-item">
			<button class="tape-button secondary" on:click={() => dispatch('signOut')}> Sign Out </button>
		</div>

		<!-- Password Change -->
		<div class="management-item">
			<!-- <h3 class="subsection-title">Password</h3> -->
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

	<!-- Danger Zone Section -->
	<section class="account-section danger-section">
		<h2 class="section-title">Delete Account</h2>
		<p class="danger-text">
			Deleting your account will permanently remove everything related to your account, including
			preferences, personal context, and RWP exercises.
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
		<p>Please type <strong>delete</strong> to confirm:</p>
		<input
			type="text"
			class="form-input"
			bind:value={deleteConfirmText}
			placeholder="Type delete"
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

	.account-section:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
	}

	.section-title {
		margin-bottom: 1.25rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312e;
	}

	/* .subsection-title {
		font-family: 'Work Sans', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #555;
	} */

	.management-item {
		/* margin-bottom: 1.5rem; */
		padding-bottom: 1.5rem;
		border-bottom: 1px solid #eee;
	}

	.management-item:last-child {
		margin-bottom: 0;
		padding-bottom: 0;
		border-bottom: none;
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

	.info-label {
		font-size: 0.875rem;
		color: #70594a;
		margin-bottom: 0.25rem;
	}

	.info-value {
		font-weight: 500;
		color: #33312e;
	}

	/* Profile reminder */
	.profile-reminder {
		background-color: rgba(52, 102, 127, 0.1);
		border-left: 4px solid #34667f;
		border-radius: 0.25rem;
		padding-top: 1rem;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-bottom: 0.1rem;
		margin-bottom: 1.5rem;
	}

	.profile-reminder h3 {
		font-family: 'Arvo', serif;
		font-size: 1.1rem;
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: #34667f;
	}

	.profile-reminder p {
		margin-bottom: 0;
		color: #33312e;
	}

	/* Form elements styling */
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

	/* Button styling */
	.tape-button {
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
		width: 100%;
	}

	.tape-button:hover:not(:disabled) {
		background-color: #c9a75f;
	}

	.tape-button:active:not(:disabled) {
		transform: translateY(2px);
		box-shadow: 0 0 0 #826d5b;
	}

	.tape-button.secondary {
		background-color: #f4f1de;
		color: #33312e;
		background-image:
			radial-gradient(circle at, rgba(193, 124, 116, 0.08) 0%, transparent 45%),
			radial-gradient(circle at 15% 50%, rgba(52, 102, 127, 0.08) 0%, transparent 45%);
	}

	.tape-button.danger {
		background-color: #c17c74cc;
		color: #f4f1de;
		margin-bottom: 1rem;
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

	.danger-section {
		background-color: #f9f0ed86;
		padding: 1.25rem;
		border-radius: 8px;
		border-left: 3px solid #c17c749c;
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
