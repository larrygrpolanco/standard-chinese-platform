<!-- ExerciseDisplay.svelte -->
<script>
	import AudioPlayer from './AudioPlayer.svelte';

	// Props
	export let exercise = {};
	export let tape = null;
	export let questions = [];

	// Exercise theme colors based on type - updated to vintage palette
	const typeStyles = {
		comprehension: {
			bg: 'bg-navy bg-opacity-10',
			text: 'text-navy',
			badge: 'bg-navy bg-opacity-20 text-navy',
			border: 'border-navy border-opacity-20'
		},
		production: {
			bg: 'bg-avocado bg-opacity-10',
			text: 'text-avocado',
			badge: 'bg-avocado bg-opacity-20 text-avocado',
			border: 'border-avocado border-opacity-20'
		}
	};

	$: styles = typeStyles[exercise.exercise_type] || {
		bg: 'bg-cream-paper',
		text: 'text-charcoal',
		badge: 'bg-warm-gray bg-opacity-20 text-charcoal',
		border: 'border-warm-gray'
	};
</script>

<div class="exercise-card border-warm-gray bg-beige overflow-hidden rounded-lg border">
	<!-- Exercise header -->
	<div class="border-warm-gray bg-cream-paper border-b px-4 py-3">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h4 class="font-arvo text-charcoal font-medium">{exercise.title}</h4>
			<span class="vintage-badge rounded px-2 py-1 text-xs font-medium capitalize">
				{exercise.exercise_type}
			</span>
		</div>
		{#if tape}
			<p class="text-warm-gray mt-1 text-sm">Tape: {tape.title}</p>
		{/if}
	</div>

	<!-- Exercise content -->
	<div class="p-4">
		<!-- Instructions -->
		{#if exercise.instructions}
			<div class="workbook-page mb-4 rounded-md border p-4 {styles.bg} {styles.border}">
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
			<div class="border-warm-gray mb-4 overflow-hidden rounded-md border">
				<img src={exercise.display_url} alt="Exercise visual" class="h-auto max-w-full" />
			</div>
		{/if}

		<!-- Questions -->
		{#if questions && questions.length > 0}
			<div class="mt-6 space-y-4">
				<h5 class="font-arvo text-charcoal font-medium">Questions</h5>

				{#each questions as question, index}
					<div class="question-card border-warm-gray rounded-md border p-4">
						<p class="text-charcoal mb-3">{index + 1}. {question.question_text}</p>

						<!-- Question type-specific UI -->
						{#if question.question_type === 'multiple_choice' && question.options}
							<div class="space-y-2">
								{#each question.options.split('|') as option}
									<label class="vintage-radio flex cursor-pointer items-center">
										<input
											type="radio"
											name={`question_${question.id}`}
											value={option}
											class="sr-only"
										/>
										<span class="vintage-radio-button mr-2"></span>
										<span>{option}</span>
									</label>
								{/each}
							</div>
						{:else if question.question_type === 'short_answer'}
							<div>
								<textarea
									class="vintage-textarea border-warm-gray bg-cream-paper w-full rounded-md border p-2"
									rows="3"
									placeholder="Enter your answer here..."
								></textarea>
							</div>
						{:else if question.question_type === 'table_row' && question.options}
							<div class="overflow-x-auto">
								<table class="vintage-table border-warm-gray min-w-full border">
									<thead>
										<tr>
											<th class="border-warm-gray bg-cream-paper border p-2"></th>
											{#each question.options.split('|') as column}
												<th class="border-warm-gray bg-cream-paper border p-2">{column}</th>
											{/each}
										</tr>
									</thead>
									<tbody>
										<tr>
											<td class="border-warm-gray border p-2">Select</td>
											{#each question.options.split('|') as column}
												<td class="border-warm-gray border p-2 text-center">
													<label class="vintage-checkbox-container">
														<input type="checkbox" class="sr-only" />
														<span class="vintage-checkbox"></span>
													</label>
												</td>
											{/each}
										</tr>
									</tbody>
								</table>
							</div>
						{:else if question.question_type === 'display_only'}
							<div class="bg-cream-paper text-warm-gray rounded-md p-3 text-sm italic">
								This question requires interaction with the display image.
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.exercise-card {
		background-color: var(--color-beige);
		background-image: url('/textures/subtle-paper.png');
		background-repeat: repeat;
	}

	.workbook-page {
		background-color: var(--color-cream-paper);
	}

	.vintage-badge {
		background-color: var(--color-gold);
		color: var(--color-charcoal);
		border: 1px solid rgba(0, 0, 0, 0.1);
	}

	.question-card {
		background-color: var(--color-beige);
	}

	.vintage-radio {
		position: relative;
		padding-left: 2px;
		margin-bottom: 8px;
	}

	.vintage-radio-button {
		position: relative;
		display: inline-block;
		width: 18px;
		height: 18px;
		border: 1px solid var(--color-warm-gray);
		border-radius: 50%;
		background: var(--color-cream-paper);
	}

	.vintage-radio input:checked + .vintage-radio-button:after {
		content: '';
		position: absolute;
		left: 4px;
		top: 4px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-terracotta);
	}

	.vintage-textarea {
		font-family: 'Work Sans', sans-serif;
		background-color: var(--color-cream-paper);
		line-height: 1.6;
	}

	.vintage-table {
		border-collapse: collapse;
		font-family: 'Work Sans', sans-serif;
	}

	.vintage-checkbox-container {
		position: relative;
		display: inline-block;
		width: 18px;
		height: 18px;
	}

	.vintage-checkbox {
		position: absolute;
		top: -1px;
		left: 0;
		width: 18px;
		height: 18px;
		border: 1px solid var(--color-warm-gray);
		background: var(--color-cream-paper);
	}

	input:checked + .vintage-checkbox:after {
		content: '';
		position: absolute;
		left: 5px;
		top: 2px;
		width: 5px;
		height: 10px;
		border: solid var(--color-terracotta);
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}
</style>
