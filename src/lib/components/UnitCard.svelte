<!-- src/lib/components/UnitCard.svelte -->
<script>
	export let unit;
	export let index;

	// Generate an emoji for each unit to make them visually distinct
	function getUnitEmoji(index) {
		const emojis = ['📝', '🗣️', '🎧', '🔍', '📚', '🗺️', '💬', '✏️'];
		return emojis[index % emojis.length];
	}
</script>

<a
	href="/units/{unit.id}"
	class="block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#1A5276] hover:shadow-md sm:p-6"
>
	<div class="flex items-start">
		<div class="mr-4 text-2xl sm:mr-6">{getUnitEmoji(index)}</div>
		<div class="flex-grow">
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-lg font-semibold text-gray-900">{unit.title}</h3>
				<span class="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
					Unit {index + 1}
				</span>
			</div>
			<p class="mb-3 text-sm text-gray-600">
				{unit.description || 'Learn key language skills and vocabulary in this unit.'}
			</p>

			<!-- Unit content preview -->
			<div class="mb-3 flex flex-wrap gap-2">
				<span class="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs text-blue-700">
					<svg class="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
						/>
					</svg>
					Audio Dialogues
				</span>
				<span class="inline-flex items-center rounded bg-green-50 px-2 py-1 text-xs text-green-700">
					<svg class="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
						/>
					</svg>
					Vocabulary
				</span>
				<span
					class="inline-flex items-center rounded bg-purple-50 px-2 py-1 text-xs text-purple-700"
				>
					<svg class="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
					Exercises
				</span>
			</div>

			<!-- Call to action -->
			<div class="flex justify-end">
				<span class="inline-flex items-center text-sm font-medium text-[#1A5276]">
					Start unit
					<svg class="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</span>
			</div>
		</div>
	</div>
</a>
