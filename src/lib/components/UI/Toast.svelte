<!-- src/lib/components/UI/Toast.svelte -->
<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let message = '';
	export let type = 'success'; // 'success' or 'error'
	export let duration = 3000;
	export let visible = false;

	let timer;

	// React to changes in the visible prop
	$: if (visible && duration > 0) {
		clearTimeout(timer);
		timer = setTimeout(() => {
			visible = false;
		}, duration);
	}

	onMount(() => {
		if (visible && duration > 0) {
			const timer = setTimeout(() => {
				visible = false;
			}, duration);

			return () => clearTimeout(timer);
		}
	});
</script>

{#if visible}
	<div class="toast {type}" transition:fly={{ y: 30, duration: 200 }} role="alert">
		<span class="toast-message">{message}</span>
	</div>
{/if}

<style>
	.toast {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		padding: 0.75rem 1.25rem;
		border-radius: 4px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		font-family: 'Work Sans', sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 250px;
		max-width: 90%;
	}

	.success {
		background-color: #d1e7dd;
		color: #0f5132;
		border-left: 4px solid #0f5132;
	}

	.error {
		background-color: #f8d7da;
		color: #842029;
		border-left: 4px solid #842029;
	}

	.toast-message {
		font-weight: 500;
	}
</style>
