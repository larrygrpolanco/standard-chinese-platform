<!-- src/lib/components/UnitContent.svelte -->
<script>
	// Props
	export let unit = {}; // Will receive unit data from parent

	// Local state
	let activeTab = 'content'; // Default tab

	// Tab switching function
	function setActiveTab(tab) {
		activeTab = tab;
	}
</script>

<div class="unit-content p-4">
	<h1 class="mb-4 text-2xl font-bold">{unit.title || 'Unit Title'}</h1>

	<!-- Tab navigation -->
	<div class="tabs mb-4 border-b">
		<button
			class="px-4 py-2 {activeTab === 'content' ? 'border-b-2 border-blue-500' : ''}"
			on:click={() => setActiveTab('content')}
		>
			Content
		</button>
		<button
			class="px-4 py-2 {activeTab === 'vocabulary' ? 'border-b-2 border-blue-500' : ''}"
			on:click={() => setActiveTab('vocabulary')}
		>
			Vocabulary
		</button>
		<button
			class="px-4 py-2 {activeTab === 'exercises' ? 'border-b-2 border-blue-500' : ''}"
			on:click={() => setActiveTab('exercises')}
		>
			Exercises
		</button>
	</div>

	<!-- Tab content -->
	<div class="tab-content">
		{#if activeTab === 'content'}
			<div class="content">
				<p>Unit content will be displayed here.</p>
			</div>
		{:else if activeTab === 'vocabulary'}
			<div class="vocabulary">
				<h2 class="mb-2 text-xl">Vocabulary</h2>
				<p>Vocabulary items will be listed here.</p>
			</div>
		{:else if activeTab === 'exercises'}
			<div class="exercises">
				<h2 class="mb-2 text-xl">Exercises</h2>
				<p>Exercise content will be shown here.</p>
			</div>
		{/if}
	</div>
</div>
