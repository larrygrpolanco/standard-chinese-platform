<script>
	import { page } from '$app/stores';
</script>

<div class="error-container">
	<h1>{$page.status}: {$page.error.message}</h1>

	{#if $page.status === 404}
		<p>The page you're looking for doesn't exist.</p>
	{:else}
		<p>Something went wrong. Please try again later.</p>
	{/if}

	<a href="/">Return to home</a>
</div>

<style>
	.error-container {
		padding: 2rem;
		max-width: 600px;
		margin: 0 auto;
		text-align: center;
	}
</style>
