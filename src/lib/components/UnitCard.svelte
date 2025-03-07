<!-- src/lib/components/UnitCard.svelte -->
<script>
	export let unit;
	export let index;

	// Generate an icon for each unit type
	function getUnitIcon(index) {
		// Set of different icons for variety
		const icons = [
			// Book icon
			`<svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>`,

			// Speech bubble icon
			`<svg class="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>`,

			// Map/Direction icon
			`<svg class="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>`,

			// Document icon
			`<svg class="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>`,

			// Microphone icon
			`<svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>`,

			// Lightbulb icon
			`<svg class="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>`
		];

		return icons[index % icons.length];
	}
</script>

<a
	href="/units/{unit.id}"
	class="block rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-[#1A5276] hover:shadow-md sm:p-6"
>
	<div class="flex items-start">
		<div class="mr-4 flex-shrink-0 sm:mr-6">
			<!-- SVG Icon instead of emoji -->
			{@html getUnitIcon(index)}
		</div>
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
