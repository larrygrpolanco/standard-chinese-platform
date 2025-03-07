<!-- src/lib/components/UnitCard.svelte -->
<script>
	export let unit;
	export let index;

	// Generate an icon for each unit type with vintage styling
	function getUnitIcon(index) {
		// Set of different icons for variety with vintage styling
		const icons = [
			// Book icon
			`<svg class="w-6 h-6 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>`,

			// Speech bubble icon
			`<svg class="w-6 h-6 text-avocado" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>`,

			// Cassette tape icon (modified for vintage feel)
			`<svg class="w-6 h-6 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M7 4v16M17 4v16M3 8h18M3 16h18" />
        <circle cx="8.5" cy="12" r="1.5" />
        <circle cx="15.5" cy="12" r="1.5" />
      </svg>`,

			// Document icon
			`<svg class="w-6 h-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>`
		];

		return icons[index % icons.length];
	}
</script>

<a
	href="/units/{unit.id}"
	class="border-warm-gray bg-beige hover:border-terracotta block rounded-lg border p-4 font-sans transition-all hover:-translate-y-1 active:translate-y-0 sm:p-6"
>
	<div class="flex items-start">
		<div class="mr-4 flex-shrink-0 sm:mr-6" style="transform: rotate(-2deg);">
			<!-- SVG Icon with slight rotation for vintage feel -->
			{@html getUnitIcon(index)}
		</div>
		<div class="flex-grow">
			<div class="mb-2 flex items-center justify-between">
				<h3 class="text-charcoal font-serif text-lg font-bold">{unit.title}</h3>
				<span
					class="bg-cream-paper text-charcoal border-warm-gray ml-2 rounded-full border px-3 py-1 text-xs font-medium"
					style="transform: rotate(-2deg);"
				>
					Unit {index + 1}
				</span>
			</div>
			<p class="text-charcoal mb-3 text-sm">
				{unit.description || 'Learn key language skills and vocabulary in this unit.'}
			</p>

			<!-- Unit content preview - styled as vintage badges -->
			<div class="mb-3 flex flex-wrap gap-2">
				<span
					class="border-navy bg-cream-paper text-navy inline-flex items-center rounded-sm border px-2 py-1 text-xs"
					style="transform: rotate(-1deg);"
				>
					<svg class="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
						/>
					</svg>
					Audio Dialogues
				</span>
				<span
					class="border-avocado bg-cream-paper text-avocado inline-flex items-center rounded-sm border px-2 py-1 text-xs"
					style="transform: rotate(1deg);"
				>
					<svg class="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
						/>
					</svg>
					Vocabulary
				</span>
				<span
					class="border-terracotta bg-cream-paper text-terracotta inline-flex items-center rounded-sm border px-2 py-1 text-xs"
					style="transform: rotate(-1deg);"
				>
					<svg class="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
						/>
					</svg>
					Exercises
				</span>
			</div>

			<!-- Call to action - styled with subtle vintage interaction -->
			<div class="flex justify-end">
				<span
					class="text-navy hover:text-terracotta group inline-flex items-center text-sm font-medium transition-colors"
				>
					Start unit
					<svg
						class="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</span>
			</div>
		</div>
	</div>
</a>
