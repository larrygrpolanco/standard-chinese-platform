<!-- src/lib/components/ExerciseDisplay.svelte -->
<script>
	import AudioPlayer from './AudioPlayer.svelte';

	// Props
	export let exercise = {};
	export let tape = null;
	export let questions = []; // Will be fetched and passed separately

	// Exercise theme colors based on type
	const typeStyles = {
		comprehension: {
			bg: 'bg-blue-50',
			text: 'text-blue-800',
			badge: 'bg-blue-100 text-blue-800',
			border: 'border-blue-100'
		},
		production: {
			bg: 'bg-green-50',
			text: 'text-green-800',
			badge: 'bg-green-100 text-green-800',
			border: 'border-green-100'
		}
	};

	$: styles = typeStyles[exercise.exercise_type] || {
		bg: 'bg-gray-50',
		text: 'text-gray-800',
		badge: 'bg-gray-100 text-gray-800',
		border: 'border-gray-100'
	};
</script>

<div class="overflow-hidden rounded-lg border border-gray-200">
	<!-- Exercise header -->
	<div class="border-b border-gray-200 bg-gray-50 px-4 py-3">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h4 class="font-medium text-gray-700">{exercise.title}</h4>
			<span class="rounded px-2 py-1 text-xs font-medium capitalize {styles.badge}">
				{exercise.exercise_type}
			</span>
		</div>
		{#if tape}
			<p class="mt-1 text-sm text-gray-500">Tape: {tape.title}</p>
		{/if}
	</div>

	<!-- Exercise content -->
	<div class="p-4">
		<!-- Instructions -->
		{#if exercise.instructions}
			<div class="mb-4 rounded-md p-4 {styles.bg} {styles.border} border">
				<p class="text-sm whitespace-pre-line {styles.text}">{exercise.instructions}</p>
			</div>
		{/if}

		<!-- Audio player -->
		{#if tape?.audio_file}
			<div class="mb-4">
				<AudioPlayer audioSrc={tape.audio_file} />
			</div>
		{/if}

		<!-- Visual display -->
		{#if exercise.display_url}
			<div class="mb-4 overflow-hidden rounded-md border border-gray-200">
				<img src={exercise.display_url} alt="Exercise visual" class="h-auto max-w-full" />
			</div>
		{/if}

		<!-- Questions -->
		{#if questions && questions.length > 0}
			<div class="mt-6 space-y-4">
				<h5 class="font-medium text-gray-700">Questions</h5>

				{#each questions as question, index}
					<div class="rounded-md border border-gray-200 p-4">
						<p class="mb-3 text-gray-700">{index + 1}. {question.question_text}</p>

						<!-- Question type-specific UI -->
						{#if question.question_type === 'multiple_choice' && question.options}
							<div class="space-y-2">
								{#each question.options.split('|') as option}
									<label class="flex cursor-pointer items-center">
										<input
											type="radio"
											name={`question_${question.id}`}
											value={option}
											class="mr-2"
										/>
										<span>{option}</span>
									</label>
								{/each}
							</div>
						{:else if question.question_type === 'short_answer'}
							<div>
								<textarea
									class="w-full rounded-md border border-gray-300 p-2"
									rows="3"
									placeholder="Enter your answer here..."
								></textarea>
							</div>
						{:else if question.question_type === 'table_row' && question.options}
							<div class="overflow-x-auto">
								<table class="min-w-full border border-gray-300">
									<thead>
										<tr>
											<th class="border border-gray-300 p-2"></th>
											{#each question.options.split('|') as column}
												<th class="border border-gray-300 p-2">{column}</th>
											{/each}
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="border border-gray-300 p-2">Select</td>
											{#each question.options.split('|') as column}
												<td class="border border-gray-300 p-2 text-center">
													<input type="checkbox" />
												</td>
											{/each}
										</tr>
									</tbody>
								</table>
							</div>
						{:else if question.question_type === 'display_only'}
							<div class="rounded-md bg-gray-50 p-3 text-sm text-gray-500 italic">
								This question requires interaction with the display image.
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
