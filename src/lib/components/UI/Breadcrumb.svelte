<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { getModuleById } from '$lib/supabase/client';

	// Dynamic breadcrumb generation
	let breadcrumbs = [];
	let moduleData = null;
	let loading = true;

	// Mapping of path segments to display names
	const pathDisplayNames = {
		modules: 'Modules',
		units: 'Units',
		guidebook: 'Guidebook',
		rwp: 'RWP',
		login: 'Login',
		profile: 'Profile'
	};

	// Create breadcrumbs based on current path
	async function generateBreadcrumbs(pathname) {
		const paths = pathname.split('/').filter(Boolean);
		let currentPath = '';
		loading = true;

		// Always start with Home
		breadcrumbs = [{ name: 'Home', path: '/', last: paths.length === 0 }];

		// Handle special case for module pages
		if (paths[0] === 'modules' && paths.length > 1 && !isNaN(paths[1])) {
			// Fetch module title from the database
			const moduleId = paths[1];
			try {
				moduleData = await getModuleById(moduleId);
			} catch (err) {
				console.error('Error fetching module data:', err);
			}
		}

		// Add path segments as breadcrumbs
		for (let i = 0; i < paths.length; i++) {
			const segment = paths[i];
			currentPath += `/${segment}`;

			let name = pathDisplayNames[segment] || segment;
			let path = currentPath;

			// Handle module IDs - use data from the database if available
			if (paths[0] === 'modules' && i === 1 && !isNaN(segment) && moduleData) {
				name = moduleData.title;
			}

			// Handle unit IDs - these require a different approach
			if (paths[0] === 'modules' && paths[2] === 'units' && i === 3 && !isNaN(segment)) {
				// Could fetch unit title from database here if needed
				name = `Unit ${segment}`;
			}

			breadcrumbs.push({
				name,
				path,
				last: i === paths.length - 1
			});
		}

		loading = false;
	}

	// Watch for route changes and update breadcrumbs
	$: {
		if ($page.url.pathname) {
			generateBreadcrumbs($page.url.pathname);
		}
	}
</script>

<div class="breadcrumb-container">
	<div class="breadcrumb-path">
		{#if loading}
			<span class="loading">Loading...</span>
		{:else}
			{#each breadcrumbs as crumb, i}
				{#if !crumb.last}
					<a href={crumb.path} class="breadcrumb-link">
						{crumb.name}
					</a>
					<div class="divider">
						<svg
							class="cassette-divider"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9 18l6-6-6-6"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</div>
				{:else}
					<span class="current-page">{crumb.name}</span>
				{/if}
			{/each}
		{/if}
	</div>
</div>

<style>
	.breadcrumb-container {
		width: 100%;
		padding: 0.5rem 1rem;
		background-color: #e8e5d7;
		border-bottom: 1px solid #a0998a;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.3);
	}

	.breadcrumb-path {
		max-width: 80rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.25rem;
		font-size: 0.875rem;
	}

	.breadcrumb-link {
		color: #34667f;
		text-decoration: none;
		font-weight: 500;
		transition: all 0.2s;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
	}

	.breadcrumb-link:hover {
		background-color: rgba(221, 185, 103, 0.2);
		color: #34667f;
	}

	.divider {
		display: flex;
		align-items: center;
		color: #a0998a;
	}

	.cassette-divider {
		width: 0.875rem;
		height: 0.875rem;
	}

	.current-page {
		color: #c17c74;
		font-weight: 600;
		padding: 0.125rem 0.25rem;
	}

	.loading {
		color: #a0998a;
		font-style: italic;
	}
</style>
