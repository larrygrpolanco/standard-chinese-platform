<!-- src/routes/modules/[id]/+page.svelte -->
<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getModuleById, getUnitsByModuleId, getUserProgress } from '$lib/supabase/client';
	import UnitCard from '$lib/components/UI/UnitCard.svelte';
	import Loader from '$lib/components/UI/Loader.svelte';

	let module = null;
	let units = [];
	let loading = true;
	let unitProgressMap = {}; // Map unit IDs to completion status
	let visibleUnits = []; // Track which units are visible

	// Learning objectives by module ID - customize these later
	const moduleObjectives = {
		'1': [
			'Understand Chinese personal name structure and titles (Mr., Mrs., Miss, Comrade).',
			"Ask and answer questions about someone's origin and location.",
			'Translate between English and Chinese expressions from the target list.',
			'Participate in short conversations about identity and origin.'
		],
		'2': [
			'Use polite Chinese to ask about identity, health, age, and other basic information.',
			'Respond to questions using Chinese equivalents for "yes" and "no".',
			'Discuss family, including members, ages, and locations in Chinese.',
			'Ask and answer questions about travel in China and work or study details.'
		],
		'3': [
			'Learn Chinese names for 15 shopping items.',
			'Conduct basic shopping conversations (availability, price, purchase).',
			'Describe items bought (quantity, size, color, price).',
			'Manage currency exchange and ask for specific change.'
		],
		'4': [
			'Translate direction-related sentences between English and Chinese.',
			'Ask for and understand directions in various locations (city, building, address).',
			'Recognize differences between Beijing and Taipei direction expressions.',
			'Give directions using single sentences based on floor plans.'
		],
		'5': [
			'Navigate bus and train systems for transportation.',
			'Utilize taxis effectively for local travel.',
			'Arrange for air travel including booking and airport logistics.',
			'Describe detailed travel experiences and plans.'
		],
		'6': [
			'Understand and translate basic Chinese sentences.',
			'Respond to and initiate introductions in Chinese.',
			'Arrange and manage meetings and social events.',
			'Handle phone calls and invitations politely.'
		],
		'7': [
			'Discuss Chinese family size and members',
			'Apply social visit etiquette in China',
			'Analyze traditional family roles and relationships',
			'Explain the significance of extended families'
		],
		'8': [
			'Plan travel arrangements in Chinese',
			'Discuss transportation options within China',
			'Learn vocabulary for travel-related situations',
			'Practice dialogues for booking and travel activities'
		],
		default: [
			'Master key vocabulary and phrases for this topic',
			'Practice essential grammar patterns and structures',
			'Engage with authentic dialogues featuring native speakers',
			'Complete practical exercises to reinforce your learning'
		]
	};
	onMount(async () => {
		loading = true;
		const moduleId = $page.params.id;
		let hasTimedOut = false;

		try {
			// Set up a master timeout for the entire data loading process
			const timeoutPromise = new Promise((_, reject) => {
				setTimeout(() => {
					hasTimedOut = true;
					reject(new Error('Data loading timeout'));
				}, 8000);
			});
			
			// Create promise for module and units data
			const moduleDataPromise = (async () => {
				// Fetch module first
				module = await getModuleById(moduleId);
				
				if (module) {
					// Fetch units and user progress in parallel
					const [unitsData, progressData] = await Promise.all([
						getUnitsByModuleId(moduleId),
						getUserProgress().catch(err => {
							console.error('Error fetching user progress:', err);
							return [];
						})
					]);
					
					units = unitsData;
					
					// Create a lookup map of unit completion status
					unitProgressMap = progressData.reduce((map, progress) => {
						map[progress.unit_id] = progress.status === 'completed';
						return map;
					}, {});
				}
			})();
			
			// Race the data loading against the timeout
			await Promise.race([moduleDataPromise, timeoutPromise]);
			
		} catch (err) {
			console.error('Error loading module data:', err);
			if (hasTimedOut) {
				// If we hit the timeout but still have basic module data, show what we have
				console.warn('Module data loading timed out, showing partial data');
			}
		} finally {
			loading = false;
			
			// Staggered reveal of units after loading is complete
			if (units.length > 0) {
				// Start with empty array
				visibleUnits = [];
				
				// Show each unit with a delay
				units.forEach((unit, index) => {
					setTimeout(() => {
						visibleUnits = [...visibleUnits, unit.id];
					}, 100 * index); // Slightly faster animation
				});
			}
		}
	});

	$: objectives = module ? moduleObjectives[module.id] || moduleObjectives.default : [];
</script>

<svelte:head>
	<title>{module?.title || 'Module'} | Taped Chinese</title>
</svelte:head>

<div class="container">
	{#if loading}
		<Loader />
	{:else if module}
		<div in:fade={{ duration: 300 }}>
			<div class="module-header">
				<a
					href="/modules"
					class="module-back-button"
					title="Back to All Modules"
				>
					<span class="module-number">{module.id}</span>
				</a>
				<h1 class="module-title">
					{module.title}
				</h1>
			</div>

			<!-- Compact info section with description and objectives -->
			<div class="info-section">
				<div class="info-content">
					<!-- Module description -->
					<div class="description-container">
						<h2 class="section-subtitle">
							About This Module
						</h2>
						<p class="description-text">{module.description}</p>
					</div>

					<!-- Divider for mobile -->
					<div class="mobile-divider"></div>

					<!-- Learning objectives -->
					<div class="objectives-container">
						<h2 class="section-subtitle">
							Learning Objectives
						</h2>
						<ul class="objectives-list">
							{#each objectives as objective}
								<li class="objective-item">
									<svg
										class="check-icon"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd"
										/>
									</svg>
									<span class="objective-text">{objective}</span>
								</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- Units section -->
		<section>
			<h2 class="units-title">Choose a Unit</h2>

			{#if units.length > 0}
				<div class="units-grid">
					{#each units as unit, index}
						{#if visibleUnits.includes(unit.id)}
							<div in:fade={{ duration: 400 }}>
								<UnitCard {unit} {index} isCompleted={!!unitProgressMap[unit.id]} />
							</div>
						{/if}
					{/each}
				</div>
				<!-- Navigation footer -->
				<div class="navigation-footer">
					<a href={`/modules`} class="back-link">
						<svg class="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M15 19l-7-7 7-7"
							></path>
						</svg>
						Back to Modules
					</a>
				</div>
			{:else}
				<div class="empty-state">
					<p class="empty-message">No units found in this module.</p>
					<a
						href="/modules"
						class="return-link"
					>
						Return to all modules
					</a>
				</div>
			{/if}
		</section>
	{:else}
		<div class="not-found">
			<h1 class="not-found-title">Module Not Found</h1>
			<p class="not-found-message">
				The module you're looking for doesn't exist or has been removed.
			</p>
			<a
				href="/modules"
				class="browse-button"
			>
				Browse All Modules
			</a>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 56rem;
		margin-left: auto;
		margin-right: auto;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	.module-header {
		margin-bottom: 1.5rem;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.module-back-button {
		display: flex;
		height: 3rem;
		width: 3rem;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		background-color: #C17C74;
		color: white;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
		transition-property: transform;
	}

	.module-back-button:hover {
		transform: scale(1.05);
	}

	.module-number {
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: bold;
	}

	.module-title {
		font-family: 'Arvo', serif;
		font-size: 1.5rem;
		font-weight: bold;
		color: #33312E;
	}

	@media (min-width: 768px) {
		.module-title {
			font-size: 1.875rem;
		}
	}

	.info-section {
		margin-bottom: 2rem;
		border-radius: 0.5rem;
		border: 1px solid #A0998A;
		background-color: #E8E5D7;
		padding: 1rem;
		box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	}

	.info-content {
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 768px) {
		.info-content {
			flex-direction: row;
			gap: 1.5rem;
		}
	}

	.description-container {
		margin-bottom: 1rem;
	}

	@media (min-width: 768px) {
		.description-container {
			margin-bottom: 0;
			width: 50%;
		}
	}

	.section-subtitle {
		margin-bottom: 0.5rem;
		font-family: 'Arvo', serif;
		font-size: 1.125rem;
		font-weight: 600;
		color: #33312E;
	}

	.description-text {
		font-size: 0.875rem;
		line-height: 1.625;
		color: #33312E;
	}

	.mobile-divider {
		margin-bottom: 1rem;
		height: 1px;
		width: 100%;
		background-color: #A0998A;
		opacity: 0.3;
	}

	@media (min-width: 768px) {
		.mobile-divider {
			display: none;
		}
	}

	.objectives-container {
		width: 100%;
	}

	@media (min-width: 768px) {
		.objectives-container {
			width: 50%;
		}
	}

	.objectives-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.objective-item {
		display: flex;
		align-items: flex-start;
	}

	.check-icon {
		margin-top: 0.25rem;
		margin-right: 0.5rem;
		height: 1rem;
		width: 1rem;
		flex-shrink: 0;
		color: #7D8C5C;
	}

	.objective-text {
		font-size: 0.875rem;
		color: #33312E;
	}

	.units-title {
		margin-bottom: 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		font-weight: 600;
		color: #33312E;
	}

	.units-grid {
		margin-bottom: 1rem;
		display: grid;
		grid-template-columns: repeat(1, minmax(0, 1fr));
		gap: 0.5rem;
	}

	.navigation-footer {
		margin-top: 2rem;
		display: flex;
		justify-content: space-between;
		border-top: 1px solid #A0998A;
		padding-top: 1rem;
	}

	.back-link {
		display: flex;
		align-items: center;
		color: #34667F;
	}

	.back-link:hover {
		color: #C17C74;
	}

	.back-icon {
		margin-right: 0.5rem;
		height: 1.25rem;
		width: 1.25rem;
	}

	.empty-state {
		border-radius: 0.5rem;
		border: 1px solid #A0998A;
		background-color: #E8E5D7;
		padding: 1.5rem;
		text-align: center;
	}

	.empty-message {
		margin-bottom: 0.5rem;
		color: #33312E;
	}

	.return-link {
		display: inline-block;
		font-weight: 500;
		color: #34667F;
	}

	.return-link:hover {
		color: #C17C74;
		text-decoration: underline;
	}

	.not-found {
		padding-top: 4rem;
		padding-bottom: 4rem;
		text-align: center;
	}

	.not-found-title {
		margin-bottom: 1rem;
		font-family: 'Arvo', serif;
		font-size: 1.25rem;
		color: #C17C74;
	}

	.not-found-message {
		margin-bottom: 1rem;
		color: #33312E;
	}

	.browse-button {
		display: inline-block;
		border-radius: 0.5rem;
		background-color: #C17C74;
		padding-left: 1rem;
		padding-right: 1rem;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
		font-weight: 500;
		color: white;
		transition-property: all;
	}

	.browse-button:hover {
		background-color: #aa6b64;
	}
</style>