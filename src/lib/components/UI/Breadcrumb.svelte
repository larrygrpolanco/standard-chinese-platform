<script>
	import { page } from '$app/stores';
	import { getModuleById, getUnitBasicInfo, getCurrentUser } from '$lib/supabase/client';
	import { onMount } from 'svelte';

	// Dynamic breadcrumb generation
	let breadcrumbs = [];
	let loading = true;
	let currentUser = null;

	// Mapping of path segments to display names
	const pathDisplayNames = {
		modules: 'Modules',
		units: 'Units',
		rwp: 'Relevant World Practice',
		resource: 'Resources',
		'more-info': 'More Information',
		'time-dates': 'Time & Dates'
	};

	// Check if user is logged in
	async function checkUserLoggedIn() {
		try {
			currentUser = await getCurrentUser();
			return !!currentUser;
		} catch (error) {
			console.error('Error checking authentication:', error);
			return false;
		}
	}

	onMount(async () => {
		await checkUserLoggedIn();
	});

	// Create breadcrumbs based on current path
	async function generateBreadcrumbs(pathname) {
		const paths = pathname.split('/').filter(Boolean);
		loading = true;

		// Always start with Home
		breadcrumbs = [{ name: 'Home', path: '/', last: paths.length === 0 }];

		try {
			// Route: /modules
			if (paths[0] === 'modules' && paths.length === 1) {
				breadcrumbs.push({ name: 'Modules', path: '/modules', last: true });
				loading = false;
				return;
			}

			// Route: /modules/:id
			if (paths[0] === 'modules' && paths.length === 2 && !isNaN(paths[1])) {
				const moduleId = paths[1];
				const moduleData = await getModuleById(moduleId);

				breadcrumbs.push({ name: 'Modules', path: '/modules', last: false });
				breadcrumbs.push({
					name: moduleData ? moduleData.title : `Module ${moduleId}`,
					path: `/modules/${moduleId}`,
					last: true
				});
				loading = false;
				return;
			}

			// Route: /units/:id
			if (paths[0] === 'units' && paths.length === 2 && !isNaN(paths[1])) {
				const unitId = paths[1];
				const unitData = await getUnitBasicInfo(unitId);

				if (unitData && unitData.module_id) {
					const moduleData = await getModuleById(unitData.module_id);

					breadcrumbs.push({ name: 'Modules', path: '/modules', last: false });

					if (moduleData) {
						breadcrumbs.push({
							name: moduleData.title,
							path: `/modules/${moduleData.id}`,
							last: false
						});
					}
				}

				breadcrumbs.push({
					name: unitData ? `Unit ${unitData.order_num}` : `Unit ${unitId}`,
					path: `/units/${unitId}`,
					last: true
				});
				loading = false;
				return;
			}

			// Route: /rwp
			if (paths[0] === 'rwp' && paths.length === 1) {
				breadcrumbs.push({ name: 'Relevant World Practice', path: '/rwp', last: true });
				loading = false;
				return;
			}

			// Route: /rwp/:unitId
			if (paths[0] === 'rwp' && paths.length === 2 && !isNaN(paths[1])) {
				const unitId = paths[1];
				const isLoggedIn = await checkUserLoggedIn();
				const unitData = await getUnitBasicInfo(unitId);

				if (isLoggedIn) {
					// If logged in: Home > Modules > Module X > Unit Y > RWP
					if (unitData && unitData.module_id) {
						const moduleData = await getModuleById(unitData.module_id);

						breadcrumbs.push({ name: 'Modules', path: '/modules', last: false });

						if (moduleData) {
							breadcrumbs.push({
								name: moduleData.title,
								path: `/modules/${moduleData.id}`,
								last: false
							});
						}

						breadcrumbs.push({
							name: unitData ? `Unit ${unitData.order_num}` : `Unit ${unitId}`,
							path: `/units/${unitId}`,
							last: false
						});
					}

					breadcrumbs.push({
						name: 'RWP Practice',
						path: `/rwp/${unitId}`,
						last: true
					});
				} else {
					// If not logged in: Home > RWP > Unit Example
					breadcrumbs.push({ name: 'Relevant World Practice', path: '/rwp', last: false });
					breadcrumbs.push({
						name: unitData ? `Unit ${unitData.order_num} Example` : `Unit ${unitId} Example`,
						path: `/rwp/${unitId}`,
						last: true
					});
				}
				loading = false;
				return;
			}

			// Route: /resource
			if (paths[0] === 'resource' && paths.length === 1) {
				breadcrumbs.push({ name: 'Resources', path: '/resource', last: true });
				loading = false;
				return;
			}

			// Route: /resource/:id
			if (paths[0] === 'resource' && paths.length === 2) {
				// Convert kebab-case to Title Case for nicer display
				const resourceName =
					pathDisplayNames[paths[1]] ||
					paths[1]
						.split('-')
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ');

				breadcrumbs.push({ name: 'Resources', path: '/resource', last: false });
				breadcrumbs.push({ name: resourceName, path: `/${paths[0]}/${paths[1]}`, last: true });
				loading = false;
				return;
			}

			// Fallback for unhandled routes
			let currentPath = '';
			for (let i = 0; i < paths.length; i++) {
				const segment = paths[i];
				currentPath += `/${segment}`;

				let name =
					pathDisplayNames[segment] ||
					segment
						.split('-')
						.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
						.join(' ');

				breadcrumbs.push({
					name,
					path: currentPath,
					last: i === paths.length - 1
				});
			}
		} catch (err) {
			console.error('Error generating breadcrumbs:', err);

			// Fallback on error
			let currentPath = '';
			for (let i = 0; i < paths.length; i++) {
				const segment = paths[i];
				currentPath += `/${segment}`;

				breadcrumbs.push({
					name: pathDisplayNames[segment] || segment,
					path: currentPath,
					last: i === paths.length - 1
				});
			}
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
