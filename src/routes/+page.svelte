<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>Taped Chinese | Digitized FSI Language Learning</title>
	<meta
		name="description"
		content="Learn Mandarin Chinese with digitized FSI course materials, including authentic audio recordings originally developed for U.S. diplomats."
	/>
</svelte:head>

<!-- Main container with paper texture background -->
<div
	class="min-h-screen bg-[#F4F1DE]"
	style="background-image: url('/textures/subtle-paper1.png'); background-repeat: repeat; background-blend-mode: overlay;"
>
	<!-- Hero Section -->
	<section class="container mx-auto px-4 py-12">
		<div class="mb-8 flex flex-col items-center">
			<!-- Headline with retro underline -->
			<div class="relative mb-6 text-center" in:fade={{ duration: 400, delay: 200 }}>
				<h1 class="font-['Arvo',serif] text-3xl font-bold text-[#33312E] md:text-4xl lg:text-5xl">
					Taped Chinese
				</h1>
				<div
					class="absolute -bottom-2 left-1/2 mb-2 h-1.5 w-3/4 -translate-x-1/2 bg-[#DDB967]"
				></div>
			</div>

			<p
				class="mb-6 max-w-xl text-center font-['Work_Sans',sans-serif] text-lg leading-relaxed text-[#33312E] opacity-90"
			>
				Diplomat-grade language training, now digitized and improved
			</p>

			<!-- Core Module -->
			<div class="relative mx-auto mb-8 w-full max-w-3xl" in:fade={{ duration: 400, delay: 400 }}>
				<!-- Module card styled as vintage cassette case -->
				<a
					href="/modules"
					class="group relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B]"
					style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 2px 2px 0 #826D5B;"
				>
					<!-- Top colored binding - using a green color -->
					<div class="h-3 w-full border-b-2 border-[#33312E] bg-[#DDB967]"></div>

					<!-- Card content -->
					<div class="flex flex-grow flex-col">
						<!-- Header section with title -->
						<div class="p-6">
							<div class="relative mb-3 flex gap-4">
								<!-- Title -->
								<h2
									class="flex-1 self-center font-['Arvo',serif] text-xl font-semibold text-[#33312E] transition-colors group-hover:text-[#C17C74]"
								>
									Core Modules
								</h2>

								<!-- Small tape icon - positioned relative to the top-right -->
								<div class="absolute top-0 right-0 opacity-70">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<rect
											x="2"
											y="4"
											width="20"
											height="16"
											rx="2"
											stroke="#33312E"
											stroke-width="2"
										/>
										<circle cx="7" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
										<circle cx="17" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
										<line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#33312E" stroke-width="1.5" />
									</svg>
								</div>
							</div>

							<!-- Progress meter styled as tape counter -->
							<div class="mt-4">
								<div class="flex items-center">
									<div
										class="mr-2 font-['Courier_New',monospace] text-xs tracking-tight opacity-80"
									>
										PROGRESS:
									</div>
									<div
										class="relative h-4 flex-grow overflow-hidden rounded-sm border border-[#33312E] bg-[#F4F1DE]"
										style="box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);"
									>
										<!-- Progress bar -->
										<div
											class="h-full w-0"
											style="transition: width 0.3s ease-out; background-color: #C17C74; opacity: 0.8;"
										></div>
										<!-- Tick marks -->
										<div
											class="pointer-events-none absolute top-0 left-0 flex h-full w-[80%] justify-between px-1
                                            "
										>
											<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
											<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
											<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
											<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
										</div>
									</div>
								</div>
								<p class="mt-1 font-['Courier_New',monospace] text-xs text-[#33312E] opacity-70">
									SIDE A - NOT STARTED
								</p>
							</div>
						</div>

						<!-- Divider with perforated line -->
						<div class="flex items-center px-4">
							<div class="flex-grow border-t border-dashed border-[#A0998A]"></div>
						</div>

						<!-- Module description -->
						<div class="bg-opacity-50 flex-grow bg-[#F4F1DE] p-4">
							<p class="font-['Work_Sans',sans-serif] text-sm leading-relaxed text-[#33312E]">
								The FSI Standard Chinese course is divided into 9 core comprehensive modules.
							</p>
						</div>

						<!-- Call to action styled as a mechanical button -->
						<div
							class="border-t-2 border-[#33312E] p-3 text-right"
							style="background: repeating-linear-gradient(45deg, #7D8C5C10, #7D8C5C10 10px, transparent 10px, transparent 20px);"
						>
							<span
								class="inline-flex items-center rounded-full border border-[#33312E] bg-[#F4F1DE] px-4 py-1.5 text-sm font-medium text-[#33312E] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[2px_2px_0_#826D5B] active:translate-y-0.5 active:shadow-none"
								style="box-shadow: 1px 1px 0 #826D5B; transition: all 0.15s ease-out;"
							>
								Browse modules
								<svg
									class="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1"
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
			</div>
			<!-- Guidebook Button (moved below module card) -->
			<div
				class="mt-4 mb-6 flex max-w-xl flex-col items-center"
				in:fade={{ duration: 400, delay: 600 }}
			>
				<a
					href="/guidebook"
					class="group relative mb-1 inline-flex items-center overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] px-6 py-3 text-lg font-bold text-[#33312E] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B] active:translate-y-0 active:shadow-none"
					style="box-shadow: 2px 2px 0 #826D5B;"
				>
					<span class="mr-2">
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="transition-transform group-hover:rotate-12"
						>
							<path
								d="M19.8978 16H7.89778C6.96781 16 6.50282 16 6.12132 16.1022C5.08604 16.3796 4.2774 17.1883 4 18.2235"
								stroke="#1C274D"
								stroke-width="1.5"
							></path>
							<path d="M8 7H16" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"></path>
							<path d="M8 10.5H13" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"
							></path>
							<path d="M19.5 19H8" stroke="#1C274D" stroke-width="1.5" stroke-linecap="round"
							></path>
							<path
								d="M10 22C7.17157 22 5.75736 22 4.87868 21.1213C4 20.2426 4 18.8284 4 16V8C4 5.17157 4 3.75736 4.87868 2.87868C5.75736 2 7.17157 2 10 2H14C16.8284 2 18.2426 2 19.1213 2.87868C20 3.75736 20 5.17157 20 8M14 22C16.8284 22 18.2426 22 19.1213 21.1213C20 20.2426 20 18.8284 20 16V12"
								stroke="#1C274D"
								stroke-width="1.5"
								stroke-linecap="round"
							></path>
						</svg>
					</span>
					Guidebook
					<svg
						class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
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
				</a>
				<p
					class="px-2 text-center font-['Work_Sans',sans-serif] text-sm text-[#33312E] italic opacity-60"
				>
					Checkout our guidebook to learn more about how to use this resource to fit your learning
					styles and other language learning tips
				</p>
			</div>
		</div>
	</section>

	<!-- RWP Section - Simplified Call to Action -->
	<section class="container mx-auto px-4 py-8">
		<div
			class="relative overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] p-8 shadow-md"
			style="box-shadow: inset 0 1px 4px rgba(51, 49, 46, 0.15), 4px 4px 0 #826D5B;"
		>
			<!-- Cassette tape design elements - positioned to not interfere with content -->
			<div
				class="absolute top-3 left-3 h-4 w-4 rounded-full border border-[#33312E] opacity-30"
			></div>
			<div
				class="absolute top-3 right-3 h-4 w-4 rounded-full border border-[#33312E] opacity-30"
			></div>
			<div
				class="absolute bottom-3 left-3 h-4 w-4 rounded-full border border-[#33312E] opacity-30"
			></div>
			<div
				class="absolute right-3 bottom-3 h-4 w-4 rounded-full border border-[#33312E] opacity-30"
			></div>

			<!-- Decorative background elements - positioned away from content -->
			<div
				class="pointer-events-none absolute -top-10 -right-10 h-20 w-20 rotate-12 rounded-full bg-[#DDB967] opacity-10"
			></div>
			<div
				class="pointer-events-none absolute -bottom-10 -left-10 h-16 w-16 rotate-12 rounded-full bg-[#7D8C5C] opacity-10"
			></div>

			<!-- Content container with proper padding -->
			<div class="relative z-10">
				<div class="mx-auto text-center">
					<h2 class="mb-4 font-['Arvo',serif] text-2xl font-bold text-[#33312E] md:text-3xl">
						Real World Practice (RWP)
					</h2>

					<p
						class="mx-auto mb-6 p-2 font-['Work_Sans',sans-serif] text-base leading-relaxed text-[#33312E] md:text-lg"
					>
						RWPs are exercises added to each unit which let you apply what you learn in each unit to
						real-life (or imagined) situations based on your interests, career, or goals. Instead of
						just repeating textbook phrases, you'll practice using Chinese in situations that matter
						to you.
						<br /> <br />
						While the classic FSI course excels at teaching structural patterns, it was designed for
						rapid memorization rather than creative language use. We hope that the RWPs added to each
						unit bridges this gap!
					</p>

					<a
						href="/rwp"
						class="group mb-2 inline-flex items-center  rounded-lg border-2 border-[#C17C74] bg-[#F4F1DE] px-6 py-3 font-medium text-[#C17C74] shadow-[2px_2px_0_#826D5B] transition-all hover:translate-x-[1px] hover:translate-y-[1px] hover:bg-[#C17C74] hover:text-white hover:shadow-[1px_1px_0_#826D5B]"
					>
						<span class=" font-['Work_Sans',sans-serif] font-semibold">Learn more</span>
						<svg
							class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
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
					</a>
				</div>

				<!-- Tape visual elements -->
				<div
					class="border-opacity-10 absolute -top-25 right-20 h-24 w-24 rotate-12 rounded-full border-8 border-[#A0998A]"
				></div>
			</div>
		</div>
	</section>

	<!-- Stats Section - "That's a lot of Chinese!" -->
	<section class="flex w-full justify-center rounded-xl bg-[#E8E5D7] py-10">
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

			<!-- Stat grid -->
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
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
			<div class="container mx-auto px-4 py-12">
				<div
					class="mt-6 flex flex-col justify-center gap-6 md:flex-row"
					in:fade={{ duration: 400, delay: 400 }}
				>
					<div
						class="rounded-lg border-2 border-[#33312E] bg-[#F8EBE8] p-4 text-center shadow-[2px_2px_0_#826D5B] md:w-1/3"
					>
						<div class="flex items-center justify-center">
							<svg
								class="mr-2 h-5 w-5 text-[#C17C74]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
							<h3 class="font-['Arvo',serif] text-lg font-bold text-[#33312E]">Free Forever</h3>
						</div>
						<p class="mt-2 text-sm text-[#33312E]">
							This digitized FSI course will always be free and accessible to everyone.
						</p>
					</div>

					<div
						class="rounded-lg border-2 border-[#33312E] bg-[#EBEEE7] p-4 text-center shadow-[2px_2px_0_#826D5B] md:w-1/3"
					>
						<div class="flex items-center justify-center">
							<svg
								class="mr-2 h-5 w-5 text-[#7D8C5C]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
								/>
							</svg>
							<h3 class="font-['Arvo',serif] text-lg font-bold text-[#33312E]">
								Authentic Materials
							</h3>
						</div>
						<p class="mt-2 text-sm text-[#33312E]">
							Created by linguists to train US diplomats - tried, tested, and effective.
						</p>
					</div>

					<div
						class="rounded-lg border-2 border-[#33312E] bg-[#F9F4E8] p-4 text-center shadow-[2px_2px_0_#826D5B] md:w-1/3"
					>
						<div class="flex items-center justify-center">
							<svg
								class="mr-2 h-5 w-5 text-[#DDB967]"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
								/>
							</svg>
							<h3 class="font-['Arvo',serif] text-lg font-bold text-[#33312E]">
								Flexible Learning
							</h3>
						</div>
						<p class="mt-2 text-sm text-[#33312E]">
							Choose your own path through the material - learn at your own pace and style.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- About Section -->
	<section class="flex w-full justify-center bg-[#F4F1DE] py-6">
		<div class="w-full max-w-4xl px-4">
			<!-- True centered flex container -->
			<div class="flex flex-col items-center justify-center gap-8 md:flex-row">
				<!-- FSI Course Info with Robocop-inspired scan lines -->
				<div class="relative w-full md:w-1/2">
					<!-- Subtle scan line effect -->
					<div
						class="absolute top-0 left-0 h-full w-[2px] bg-gradient-to-b from-transparent via-[#33312E]/10 to-transparent"
					></div>

					<div class="p-4">
						<h2 class="relative mb-4 font-['Arvo',serif] text-2xl font-bold text-[#33312E]">
							<span class="relative inline-block">
								About This Project
								<!-- Underline with ROBOCOP-style scan animation -->
								<span class="absolute -bottom-1 left-0 h-[2px] w-full bg-[#33312E]/20"></span>
								<span class="absolute -bottom-1 left-0 h-[2px] w-8 animate-pulse bg-[#C17C74]"
								></span>
							</span>
						</h2>
						<p class="mb-4 font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
							Taped Chinese digitizes the Foreign Service Institute's "Standard Chinese: A Modular
							Approach" course materials from the 1970s, which were created to be flixible enough to
							meet the requirements of government agencies and academic instituions. While dated, it
							is comprehensive, structured, and parts of it still hold up to modern langauge
							pedagogy standards.
						</p>
						<p class="font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E]">
							While the original cassette tapes and materials may be vintage, some of the teaching
							methods and philosophies still hold up to modern language teaching standards. Our goal
							is to preserve this resource and make it accessible to modern language learners.
							Everything is freely available as these materials are in the public domain.
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
								<div class="absolute top-0 left-0 h-1 w-full bg-[#34667F]/20"></div>

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
									<div class="h-full w-6 animate-pulse bg-[#C17C74]/60"></div>
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
