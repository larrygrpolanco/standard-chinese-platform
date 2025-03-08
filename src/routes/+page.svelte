<!-- src/routes/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { getModules } from '$lib/supabase/client';

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
	<!-- Hero Section with true center alignment -->
	<section class="flex w-full justify-center py-12 md:py-16">
		<!-- Centered container with fixed width -->
		<div class="w-full max-w-4xl px-4">
			<!-- Title with OCP-inspired scan highlight - truly centered -->
			<div class="mb-8 flex flex-col items-center justify-center text-center">
				<!-- Scan highlight effect (ROBOCOP HUD) -->
				<div
					class="absolute inset-0 animate-pulse bg-gradient-to-b from-transparent via-[#DDB967]/10 to-transparent"
				></div>

				<h1
					class="mb-2 text-center font-['Arvo',serif] text-4xl font-bold text-[#33312E] md:text-5xl"
				>
					Taped Chinese
				</h1>

				<!-- Underline inspired by ROBOCOP's visor -->
				<div class="relative mt-2 h-1 w-24 overflow-hidden bg-[#34667F] md:w-32">
					<div
						class="absolute top-0 left-0 h-full w-8 animate-[scanRight_3s_ease-in-out_infinite] bg-[#DDB967]"
					></div>
				</div>

				<p
					class="mx-auto mt-4 max-w-2xl text-center font-['Work_Sans',sans-serif] text-lg text-[#33312E]"
				>
					Diplomat-grade language training, now digitized and ready for you
				</p>
			</div>

			<!-- Featured modules - main content area with true center alignment -->
			<div
				class="relative mx-auto w-full rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] p-6 shadow-[4px_4px_0_#826D5B] md:p-8"
			>
				<!-- Decorative cassette tape corner icon with Robocop-like detail -->
				<div class="absolute -top-6 -right-6 hidden md:block">
					<div class="relative h-16 w-20 rotate-12">
						<div class="h-full w-full rounded-md border-2 border-[#33312E] bg-[#E8E5D7]">
							<!-- Robocop-inspired scan line -->
							<div class="absolute top-1/2 right-0 left-0 h-[2px] bg-[#34667F]/30"></div>
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

				<!-- True centered heading with terminal-like styling -->
				<div class="mb-8 flex w-full justify-center text-center">
					<h2 class="relative font-['Arvo',serif] text-2xl font-bold text-[#33312E]">
						<span class="relative inline-block">
							<!-- ROBOCOP-inspired targeting brackets -->
							<span
								class="absolute top-1/2 -left-6 h-[18px] w-[6px] -translate-y-1/2 border-t-2 border-l-2 border-[#C17C74]/70"
							></span>
							<span
								class="absolute top-1/2 -right-6 h-[18px] w-[6px] -translate-y-1/2 border-t-2 border-r-2 border-[#C17C74]/70"
							></span>
							Choose a Module & Start Learning
						</span>
					</h2>
				</div>

				{#if loading}
					<!-- ROBOCOP-inspired loading animation - truly centered -->
					<div class="flex items-center justify-center py-12">
						<div class="relative h-20 w-20">
							<div
								class="absolute inset-0 animate-spin rounded-full border-4 border-[#DDB967] border-t-transparent"
							></div>
							<div
								class="absolute inset-2 animate-spin rounded-full border-2 border-[#34667F] border-b-transparent"
								style="animation-duration: 1.5s;"
							></div>
							<div
								class="absolute inset-0 flex items-center justify-center font-['Courier_New',monospace] text-xs text-[#33312E]"
							>
								LOADING
							</div>
						</div>
					</div>
				{:else}
					<!-- True centered grid -->
					<div class="mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2">
						{#each modules.filter((module) => featuredModules.includes(module.id)) as module}
							{@const colors = getModuleColors(module.id)}
							<a
								href="/modules/{module.id}"
								class="group relative flex h-full overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#F4F1DE] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B]"
								style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.3), 2px 2px 0 #826D5B;"
							>
								<!-- Left color bar with Robocop-style scan line -->
								<div
									class="relative h-full w-2 {colors.bg} overflow-hidden border-r-2 border-[#33312E]"
								>
									<div
										class="absolute top-0 left-0 h-2 w-full animate-[scanDown_4s_ease-in-out_infinite] bg-[#DDB967]/20"
									></div>
								</div>

								<div class="flex flex-grow p-3">
									<!-- Module number badge with OCP-inspired styling -->
									<div class="mr-3 flex-shrink-0">
										<div
											class="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#33312E] {colors.bg}"
											style="transform: rotate(-5deg); box-shadow: 1px 1px 0 #826D5B;"
										>
											<!-- Terminal-like screen effect -->
											<div
												class="absolute inset-0 rounded-full opacity-30"
												style="background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);"
											></div>
											<span class="relative font-['Arvo',serif] text-lg font-bold text-[#33312E]">
												{module.id}
											</span>
										</div>
									</div>

									<div class="flex-grow">
										<h3 class=" mb-1 font-['Arvo',serif] text-base font-semibold text-[#33312E]">
											{module.title}
										</h3>
										<p class="mb-2 line-clamp-2 font-['Work_Sans',sans-serif] text-xs">
											{module.description}
										</p>

										<!-- Mechanical button with ROBOCOP-inspired highlights -->
										<span
											class="relative inline-flex items-center overflow-hidden rounded-full border border-[#33312E] bg-white px-3 py-1 text-xs font-medium text-[#33312E] transition-all group-hover:bg-[#F9F4E8] group-hover:shadow-[2px_2px_0_#826D5B]"
											style="box-shadow: 1px 1px 0 #826D5B; transition: all 0.15s ease-out;"
										>
											<!-- Button highlight (like Robocop's visor) -->
											<div
												class="crt-effect-local absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30"
												style="transform: skew(-45deg) translateX(-100%); transition: transform 0.5s ease-out;"
											></div>

											<span class="relative mr-1 text-xs" style="color: {colors.accent};">▶</span>
											<span class="relative">Start Module {module.id}</span>
											<svg
												class="relative ml-1 h-3 w-3 transition-transform group-hover:translate-x-1"
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

					<!-- True centered disclaimer with datapad styling -->
					<div class="mt-6 flex w-full justify-center">
						<div
							class="relative inline-block rounded-lg border border-[#A0998A] bg-[#F9F4E8] px-4 py-2"
						>
							<!-- ROBOCOP targeting frame -->
							<div class="absolute top-0 left-0 h-2 w-2 border-t border-l border-[#34667F]"></div>
							<div class="absolute top-0 right-0 h-2 w-2 border-t border-r border-[#34667F]"></div>
							<div
								class="absolute bottom-0 left-0 h-2 w-2 border-b border-l border-[#34667F]"
							></div>
							<div
								class="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-[#34667F]"
							></div>

							<p class="font-['Work_Sans',sans-serif] text-sm text-[#33312E]">
								<span class="font-bold">Beta Testing:</span> Currently only Modules 4 and 6 have content.
								More modules coming soon!
							</p>
						</div>
					</div>

					<!-- True centered CTA button -->
					<div class="mt-6 flex w-full justify-center">
						<a
							href="/modules"
							class="crt-effect-local relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-[#33312E] bg-[#C17C74] px-6 py-3 text-lg font-bold text-white transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B]"
							style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.2), 2px 2px 0 #826D5B;"
						>
							<!-- ROBOCOP visor-like scan effect -->
							<div
								class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20"
								style="transform: skew(-45deg) translateX(-150%); transition: transform 0.6s ease-out;"
							></div>

							<span class="relative">Browse All 9 Modules</span>
							<svg
								class="relative ml-2 h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								></path>
							</svg>
						</a>
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Decorative cassette tapes - true center -->
	<section class="flex w-full justify-center">
		<div class="mx-auto w-full max-w-4xl px-4 py-12">
			<!-- Guaranteed centered container for cassettes -->
			<div class="flex justify-center">
				<!-- Cassette container with fixed width center positioning -->
				<div class="relative flex h-44 w-full max-w-md justify-center md:h-48">
					<!-- Left tape with Robocop-inspired details -->
					<div
						class="absolute left-0 h-32 w-48 translate-x-[-20%] rotate-[-8deg] transform md:h-40 md:w-56"
					>
						<div
							class="crt-effect-local relative h-full w-full overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] shadow-[4px_4px_0_#826D5B]"
						>
							<!-- Metallic sheen effect -->
							<div
								class="absolute inset-0 bg-gradient-to-br from-white via-transparent to-transparent opacity-20"
							></div>

							<!-- Scan line (Robocop HUD) -->
							<div
								class="absolute top-0 left-0 h-1 w-full animate-[scanDown_2.5s_ease-in-out_infinite] bg-[#34667F]/30"
							></div>

							<!-- Tape label -->
							<div
								class="absolute top-1/4 left-1/2 h-1/4 w-3/4 -translate-x-1/2 transform rounded-sm bg-[#DDB967]"
							>
								<div class="absolute inset-1 flex items-center justify-center rounded-sm bg-white">
									<span
										class="font-['Courier_New',monospace] text-xs tracking-wide uppercase md:text-sm"
										>TAPED CHINESE</span
									>
								</div>
							</div>

							<!-- Tape reels -->
							<div class="absolute top-1/2 right-0 left-0 mt-4 flex justify-between px-6">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#33312E] md:h-12 md:w-12"
								>
									<div class="h-3 w-3 rounded-full border border-[#33312E] md:h-4 md:w-4"></div>
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#33312E] md:h-12 md:w-12"
								>
									<div class="h-3 w-3 rounded-full border border-[#33312E] md:h-4 md:w-4"></div>
								</div>
							</div>
						</div>
					</div>

					<!-- Right tape with Robocop-inspired details -->
					<div
						class="absolute right-0 h-32 w-48 translate-x-[20%] rotate-[8deg] transform md:h-40 md:w-56"
					>
						<div
							class="crt-effect-local relative h-full w-full overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] shadow-[4px_4px_0_#826D5B]"
						>
							<!-- Metallic sheen effect -->
							<div
								class="absolute inset-0 bg-gradient-to-bl from-white via-transparent to-transparent opacity-20"
							></div>

							<!-- Scan line (Robocop HUD) -->
							<div
								class="absolute bottom-0 left-0 h-1 w-full animate-[scanUp_2.5s_ease-in-out_infinite] bg-[#34667F]/30"
							></div>

							<!-- Tape label -->
							<div
								class="absolute top-1/4 left-1/2 h-1/4 w-3/4 -translate-x-1/2 transform rounded-sm bg-[#C17C74]"
							>
								<div class="absolute inset-1 flex items-center justify-center rounded-sm bg-white">
									<span
										class="font-['Courier_New',monospace] text-xs tracking-wide uppercase md:text-sm"
										>MANDARIN</span
									>
								</div>
							</div>

							<!-- Tape reels -->
							<div class="absolute top-1/2 right-0 left-0 mt-4 flex justify-between px-6">
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#33312E] md:h-12 md:w-12"
								>
									<div class="h-3 w-3 rounded-full border border-[#33312E] md:h-4 md:w-4"></div>
								</div>
								<div
									class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#33312E] md:h-12 md:w-12"
								>
									<div class="h-3 w-3 rounded-full border border-[#33312E] md:h-4 md:w-4"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

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
									class="absolute -bottom-1 left-0 h-[2px] w-8 animate-[scanRight_2s_ease-in-out_infinite] bg-[#C17C74]"
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
								class="crt-effect-local relative h-full w-full overflow-hidden rounded-sm border-2 border-[#33312E] bg-[#F9F4E8]"
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
								class="crt-effect-local relative h-full w-full overflow-hidden rounded-md border-2 border-[#33312E] bg-[#E8E5D7]"
							>
								<!-- Terminal-like readout line -->
								<div class="absolute top-2 right-4 left-4 flex h-2 items-center bg-[#33312E]/10">
									<div
										class="h-full w-6 animate-[scanRight_2s_ease-in-out_infinite] bg-[#C17C74]/60"
									></div>
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
	/* ROBOCOP-inspired animations */
	@keyframes scanRight {
		0%,
		100% {
			transform: translateX(-100%);
		}
		50% {
			transform: translateX(100%);
		}
	}

	@keyframes scanDown {
		0%,
		100% {
			transform: translateY(-100%);
		}
		50% {
			transform: translateY(100%);
		}
	}

	@keyframes scanUp {
		0%,
		100% {
			transform: translateY(100%);
		}
		50% {
			transform: translateY(-100%);
		}
	}
</style>
