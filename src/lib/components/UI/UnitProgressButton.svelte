<!-- src/lib/components/UnitProgressButton.svelte -->
<script>
	import { updateUnitProgress } from '$lib/supabase/client.js';

	export let unitId;
	export let initialStatus = 'in_progress';

	let status = initialStatus;
	let loading = false;

	async function toggleStatus() {
		loading = true;
		try {
			const newStatus = status === 'completed' ? 'in_progress' : 'completed';
			await updateUnitProgress(unitId, newStatus);
			status = newStatus;
		} catch (error) {
			console.error('Error updating progress:', error);
		} finally {
			loading = false;
		}
	}
</script>

<button class="progress-btn {status}" on:click={toggleStatus} disabled={loading}>
	{#if loading}
		<span class="loading-spinner"></span>
	{:else if status === 'completed'}
		<span class="check-icon">✓</span> Completed
	{:else}
		Mark as Completed
	{/if}
</button>

<style>
	.progress-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 8px 16px;
		border-radius: 16px;
		font-weight: 600;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid #a0998a;
		min-width: 140px;
	}

	.progress-btn.completed {
		background-color: #7d8c5c; /* Green from style guide */
		color: #f4f1de; /* Cream paper */
		border-color: #7d8c5c;
	}

	.progress-btn.in_progress {
		background-color: #e8e5d7; /* Beige */
		color: #33312e; /* Charcoal */
	}

	.progress-btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 2px 4px rgba(130, 109, 91, 0.2);
	}

	.progress-btn:active:not(:disabled) {
		transform: translateY(1px);
		box-shadow: none;
	}

	.progress-btn:disabled {
		opacity: 0.7;
		cursor: wait;
	}

	.check-icon {
		margin-right: 4px;
	}

	.loading-spinner {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid currentColor;
		border-radius: 50%;
		border-right-color: transparent;
		animation: spin 0.75s linear infinite;
		margin-right: 8px;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
