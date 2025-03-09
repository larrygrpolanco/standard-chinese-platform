<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { getModules } from '$lib/supabase/client';
	import Loader from '$lib/components/Loader.svelte';

	let modules = [];
	let loading = true;
	let featuredModules = [4, 6]; // Only modules with content so far

	onMount(async () => {
		modules = await getModules();
		loading = false;
	});

	// Function to get color attributes based on module number
	function getModuleColors(moduleNumber) {
		const colors = [
			{ border: 'border-[#C17C74]', bg: 'bg-[#F8EBE8]', accent: '#C17C74' }, // Terracotta
			{ border: 'border-[#7D8C5C]', bg: 'bg-[#EBEEE7]', accent: '#7D8C5C' }, // Avocado
			{ border: 'border-[#DDB967]', bg: 'bg-[#F9F4E8]', accent: '#DDB967' }, // Gold
			{ border: 'border-[#34667F]', bg: 'bg-[#EAF0F3]', accent: '#34667F' } // Navy
		];
		return colors[(moduleNumber - 1) % colors.length];
	}
</script>

<svelte:head>
	<title>Taped Chinese | Digitized FSI Language Learning</title>
	<meta
		name="description"
		content="Learn Chinese with authentic vintage FSI audio materials originally designed for U.S. diplomats, now digitized."
	/>
</svelte:head>

<!-- Main container with perfect centering -->
<div class="flex min-h-screen flex-col items-center justify-center bg-[#F4F1DE]">
	<!-- src/routes/+page.svelte -->
	<!-- Hero Section -->
	<section class="flex w-full justify-center py-2 md:py-2">
		<!-- Centered container with fixed width -->
		<div class="w-full max-w-4xl px-4">
			<!-- Title area - simplified and refined -->
			<div class="mb-8 flex flex-col items-center justify-center text-center">
				<h1 class="mb-2 font-['Arvo',serif] text-4xl font-bold text-[#33312E] md:text-5xl">
					Taped Chinese
				</h1>

				<!-- Refined underline with more subtle animation -->
				<div class="relative mt-2 h-1 w-24 overflow-hidden bg-[#34667F]/70 md:w-32">
					<div
						class="absolute top-0 left-0 h-full w-8 animate-[scanRight_4s_ease-in-out_infinite] bg-[#DDB967]/60"
					></div>
				</div>

				<p
					class="mx-auto mt-4 max-w-2xl text-center font-['Work_Sans',sans-serif] text-lg text-[#33312E]"
				>
					Diplomat-grade language training, now digitized and improved
				</p>
			</div>

			<!-- Featured modules - main content area -->
			<div
				class="relative mx-auto w-full rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] p-6 shadow-[4px_4px_0_#826D5B] md:p-8"
			>
				<!-- Cassette tape corner icon - kept but simplified -->
				<div class="absolute -top-6 -right-6 hidden md:block">
					<div class="relative h-16 w-20 rotate-12">
						<div class="h-full w-full rounded-md border-2 border-[#33312E] bg-[#E8E5D7]">
							<!-- Subtle line instead of scan line -->
							<div class="absolute top-1/2 right-0 left-0 h-[1px] bg-[#34667F]/20"></div>
							<div
								class="absolute top-1/2 left-1/2 h-8 w-10 -translate-x-1/2 -translate-y-1/2 transform"
							>
								<div
									class="absolute top-0 left-0 h-4 w-4 rounded-full border border-[#33312E]"
								></div>
								<div
									class="absolute top-0 right-0 h-4 w-4 rounded-full border border-[#33312E]"
								></div>
							</div>
						</div>
					</div>
				</div>

				<!-- Section heading - simplified -->
				<div class="mb-8 flex w-full justify-center text-center">
					<h2 class="font-['Arvo',serif] text-2xl font-bold text-[#33312E]">
						Choose a Module & Start Learning
					</h2>
				</div>

				{#if loading}
					<!-- Loading animation - simplified -->
					<div class="flex items-center justify-center py-12">
						<div class="relative h-20 w-20">
							<div
								class="absolute inset-0 animate-spin rounded-full border-4 border-[#DDB967]/30 border-t-[#DDB967]"
							></div>
							<div
								class="absolute inset-0 flex items-center justify-center font-['Courier_New',monospace] text-xs text-[#33312E]"
							>
								LOADING
							</div>
						</div>
					</div>
				{:else}
					<!-- Module cards grid -->
					<div class="mx-auto mb-2 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
						{#each modules.filter((module) => featuredModules.includes(module.id)) as module}
							{@const colors = getModuleColors(module.id)}
							<a
								href="/modules/{module.id}"
								class="group relative flex h-full overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#F4F1DE] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B]"
								style="box-shadow: inset 0 1px 10px rgba(255, 255, 255, 0.2), 2px 2px 0 #826D5B;"
							>
								<!-- Left color bar - simplified -->
								<div class="relative h-full w-2 {colors.bg} border-r-2 border-[#33312E]"></div>

								<div class="flex flex-grow p-3">
									<!-- Module number badge - simplified -->
									<div class="mr-3 flex-shrink-0">
										<div
											class="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#33312E] {colors.bg}"
											style="transform: rotate(-5deg); box-shadow: 1px 1px 0 #826D5B;"
										>
											<span class="font-['Arvo',serif] text-lg font-bold text-[#33312E]">
												{module.id}
											</span>
										</div>
									</div>

									<div class="flex-grow">
										<h3 class="mb-1 font-['Arvo',serif] text-base font-semibold text-[#33312E]">
											{module.title}
										</h3>
										<p class="mb-2 line-clamp-2 font-['Work_Sans',sans-serif] text-xs">
											{module.description}
										</p>

										<!-- Button - simplified -->
										<span
											class="inline-flex items-center rounded-full border border-[#33312E] bg-amber-50 px-3 py-1 text-xs font-medium text-[#33312E] transition-all group-hover:bg-[#F9F4E8] group-hover:shadow-[2px_2px_0_#826D5B]"
											style="box-shadow: 1px 1px 0 #826D5B; transition: all 0.15s ease-out;"
										>
											<span class="mr-1 text-xs" style="color: {colors.accent};">▶</span>
											<span>Start Module {module.id}</span>
											<svg
												class="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M14 5l7 7m0 0l-7 7m7-7H3"
												/>
											</svg>
										</span>
									</div>
								</div>
							</a>
						{/each}
					</div>

					<!-- Beta testing disclaimer - simplified -->
					<div class="mt-6 flex w-full justify-center">
						<div class="rounded-lg border border-[#C17C74] bg-[#F9F4E8] px-4 py-2">
							<p class="font-['Work_Sans',sans-serif] p-2 text-center text-sm text-[#33312E]">
								<span class="font-bold">Beta Testing:</span> <br>Currently only Modules 4 and 6 have content.
								More modules coming soon!
							</p>
						</div>
					</div>

					<!-- CTA button - simplified -->
					<div class="mt-6 flex w-full justify-center p-2">
						<a
							href="/modules"
							class="inline-flex items-center justify-center rounded-full border-2 p-2 border-[#33312E] bg-[#DDB967] px-6 py-3 text-lg font-bold text-[#33312E] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B]"
							style="box-shadow: 2px 2px 0 #826D5B;"
						>
							<span>Browse All 9 Modules</span>
							<svg class="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								/>
							</svg>
						</a>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<style>
		/* Simplified animation */
		@keyframes scanRight {
			0%,
			100% {
				transform: translateX(-100%);
			}
			50% {
				transform: translateX(100%);
			}
		}
	</style>



	<!-- Stats Section with true center -->
	<section class="flex w-full justify-center rounded-xl bg-[#F4F1DE] py-10">
		<div class="w-full max-w-4xl px-4">
			<!-- True centered heading with Robocop-inspired bracket design -->
			<div class="mb-8 flex w-full justify-center">
				<h2 class="relative inline-block font-['Arvo',serif] text-2xl font-bold text-[#34667F]">
					<!-- OCP-style bracket framing -->
					<span class="absolute top-0 -left-8 h-[2px] w-6 bg-[#DDB967]"></span>
					<span class="absolute top-0 -right-8 h-[2px] w-6 bg-[#DDB967]"></span>
					<span class="absolute -top-2 -left-2 h-4 w-[2px] bg-[#DDB967]"></span>
					<span class="absolute -top-2 -right-2 h-4 w-[2px] bg-[#DDB967]"></span>
					That's a lot of Chinese!
				</h2>
			</div>

			<!-- Truly centered stat grid -->
			<div class="">
				<!-- Hours of Audio -->
				<div class="flex flex-col items-center justify-center">
					<div class="relative">
						<!-- Robocop-inspired data readout styling -->
						<div class="relative font-['Arvo',serif] text-4xl font-bold text-[#C17C74]">
							<span class="relative">59</span>
							<!-- Data verify glint animation -->
							<div class="absolute top-0 -right-4 h-full w-1 animate-pulse bg-[#C17C74]/30"></div>
						</div>
					</div>
					<div class="mt-1 font-medium text-[#7D8C5C]">Hours of Audio</div>
				</div>

				<!-- Learning Modules -->
				<div class="flex flex-col items-center justify-center">
					<div class="relative">
						<!-- Robocop-inspired data readout styling with CRT effect -->
						<div class="relative font-['Arvo',serif] text-4xl font-bold text-[#34667F]">
							<span class="relative">55</span>
							<!-- Data verify glint animation -->
							<div class="absolute top-0 -right-4 h-full w-1 animate-pulse bg-[#34667F]/30"></div>
						</div>
					</div>
					<div class="mt-1 font-medium text-[#7D8C5C]">Learning Modules</div>
				</div>

				<!-- Pages of Instruction -->
				<div class="flex flex-col items-center justify-center">
					<div class="relative">
						<!-- Robocop-inspired data readout styling -->
						<div class="relative font-['Arvo',serif] text-4xl font-bold text-[#DDB967]">
							<span class="relative">2,496</span>
							<!-- Data verify glint animation -->
							<div class="absolute top-0 -right-4 h-full w-1 animate-pulse bg-[#DDB967]/30"></div>
						</div>
					</div>
					<div class="mt-1 font-medium text-[#7D8C5C]">Pages of Material</div>
				</div>
			</div>
		</div>
	</section>

	<!-- About Section with true center -->
	<section class="flex w-full justify-center bg-[#E8E5D7] py-12">
		<div class="w-full max-w-4xl px-4">
			<!-- True centered flex container -->
			<div class="flex flex-col items-center justify-center gap-8 md:flex-row">
				<!-- FSI Course Info with Robocop-inspired scan lines -->
				<div class="relative w-full md:w-1/2">
					<!-- Subtle scan line effect -->
					<div
						class="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-transparent via-[#33312E]/10 to-transparent"
					></div>

					<div class="pl-4">
						<h2 class="relative mb-4 font-['Arvo',serif] text-2xl font-bold text-[#33312E]">
							<span class="relative inline-block">
								About This Project
								<!-- Underline with ROBOCOP-style scan animation -->
								<span class="absolute -bottom-1 left-0 h-[2px] w-full bg-[#33312E]/20"></span>
								<span
									class="absolute -bottom-1 left-0 h-[2px] w-8 translate-x-8 animate-[scanRight_2s_ease-in-out_infinite] bg-[#C17C74]"
								></span>
							</span>
						</h2>
						<p class="mb-4 font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
							The FSI Standard Chinese course was originally developed to train U.S. diplomats
							heading to China. It's comprehensive, structured, and proven effective over decades of
							use.
						</p>
						<p class="font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
							This platform digitizes and modernizes the vintage materials, preserving the
							exceptional teaching methodology while making it accessible to today's learners.
						</p>
					</div>
				</div>

				<!-- Decorative vintage elements with Robocop-inspired enhancements - centered -->
				<div class="flex w-full justify-center md:w-1/2">
					<div class="relative h-48 w-64">
						<!-- Stacked books with tech enhancements -->
						<div class="absolute bottom-0 left-4 h-36 w-48 rotate-[-8deg]">
							<div
								class="relative h-full w-full overflow-hidden rounded-sm border-2 border-[#33312E] bg-[#F9F4E8]"
							>
								<!-- Robocop-style scan line -->
								<div
									class="absolute top-0 left-0 h-1 w-full animate-[scanDown_3s_ease-in-out_infinite] bg-[#34667F]/20"
								></div>

								<div
									class="absolute top-0 left-0 h-8 w-full border-b-2 border-[#33312E] bg-[#7D8C5C]"
								></div>
								<div class="absolute top-12 right-4 left-4">
									<div class="h-2 bg-[#A0998A]"></div>
									<div class="mt-3 h-2 bg-[#A0998A]"></div>
									<div class="mt-3 h-2 bg-[#A0998A]"></div>
									<div class="mt-3 h-2 bg-[#A0998A]"></div>
								</div>
							</div>
						</div>

						<!-- Cassette tape on top with Robocop-inspired data readout -->
						<div class="absolute top-0 right-0 h-28 w-44 rotate-[5deg]">
							<div
								class="relative h-full w-full overflow-hidden rounded-md border-2 border-[#33312E] bg-[#E8E5D7]"
							>
								<!-- Terminal-like readout line -->
								<div class="absolute top-2 right-4 left-4 flex h-2 items-center bg-[#33312E]/10">
									<!-- <div
										class="h-full w-6 animate-[scanRight_4s_ease-in-out_infinite] bg-[#C17C74]/60"
									></div> -->
								</div>

								<div
									class="absolute top-1/2 left-1/2 h-14 w-28 -translate-x-1/2 -translate-y-1/2 transform"
								>
									<div
										class="absolute top-0 left-0 h-8 w-8 rounded-full border border-[#33312E]"
									></div>
									<div
										class="absolute top-0 right-0 h-8 w-8 rounded-full border border-[#33312E]"
									></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	/* Simplified animation */
	@keyframes scanRight {
		0%,
		100% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(100%);
		}
	}
</style>
