<!-- src/lib/components/UI/ConfirmationModal.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';

	export let title = 'Confirmation'; // Changed from message to title
	export let confirmButtonText = 'Yes';
	export let cancelButtonText = 'No';
	export let isDanger = false;
	export let loading = false; // Add loading state

	const dispatch = createEventDispatcher();

	function confirm() {
		dispatch('confirm');
	}

	function cancel() {
		dispatch('cancel');
	}

	// Close on escape key
	function handleKeydown(event) {
		if (event.key === 'Escape' && !loading) {
			cancel();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="modal-backdrop" on:click={!loading && cancel} role="presentation">
	<div class="modal-container" on:click|stopPropagation role="dialog">
		<div class="modal-content">
			<h2 class="modal-title">{title}</h2>

			<div class="modal-body">
				<slot />
			</div>

			<div class="buttons">
				<button class="tape-button secondary" on:click={cancel} disabled={loading}>
					{cancelButtonText}
				</button>

				<button
					class="tape-button {isDanger ? 'danger' : ''}"
					on:click={confirm}
					disabled={loading}
				>
					{loading ? 'Processing...' : confirmButtonText}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-container {
		width: 90%;
		max-width: 400px;
		background-color: #f4f1de;
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		padding: 1.5rem;
	}

	.modal-content {
		text-align: center;
	}

	.modal-title {
		margin: 0 0 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		color: #33312e;
	}

	.modal-body {
		margin-bottom: 1.5rem;
		font-family: 'Work Sans', sans-serif;
	}

	.buttons {
		display: flex;
		justify-content: center;
		gap: 1rem;
	}

	.tape-button {
		padding: 0.75rem 1.25rem;
		min-width: 100px;
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

	.tape-button.secondary {
		background-color: #e8e5d7;
		color: #33312e;
	}

	.tape-button.danger {
		background-color: #c17c74;
		color: #f4f1de;
	}

	.tape-button:hover {
		filter: brightness(0.95);
	}

	.tape-button:active {
		transform: translateY(2px);
		box-shadow: 0 0 0 #826d5b;
	}

	@media (max-width: 480px) {
		.buttons {
			flex-direction: column;
			gap: 0.75rem;
		}

		.tape-button {
			width: 100%;
		}
	}
</style>
