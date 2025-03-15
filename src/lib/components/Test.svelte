<!-- src/routes/modules/+page.svelte -->
<script>
	import { onMount } from 'svelte';
	import { getModules } from '$lib/supabase/client';
	import Loader from '$lib/components/UI/Loader.svelte';

	let modules = [];
	let loading = true;

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
	<title>Modules | Taped Chinese</title>
	<meta
		name="description"
		content="Explore the FSI Standard Chinese course modules with authentic vintage audio recordings originally developed for U.S. diplomats."
	/>
</svelte:head>

<!-- Subtle paper texture background -->
<div
	class="min-h-screen bg-[#F4F1DE] pb-12"
	style="background-image: url('/textures/subtle-paper.png'); background-repeat: repeat; background-blend-mode: overlay;"
>
	<section class="container mx-auto px-4">
		<!-- Vintage-inspired header -->
		<header class="relative mb-10 pt-6">
			<!-- Decorative cassette tape icon -->
			<div class="absolute -top-2 right-8 hidden h-16 w-24 rotate-12 opacity-30 md:block">
				<div class="relative h-full w-full rounded-md border-2 border-[#33312E] bg-[#E8E5D7]">
					<div
						class="absolute top-1/2 left-1/2 h-8 w-10 -translate-x-1/2 -translate-y-1/2 transform"
					>
						<div class="absolute top-0 left-0 h-4 w-4 rounded-full border border-[#33312E]"></div>
						<div class="absolute top-0 right-0 h-4 w-4 rounded-full border border-[#33312E]"></div>
					</div>
				</div>
			</div>

			<!-- Title with retro underline -->
			<div class="relative inline-block">
				<h1 class=" font-['Arvo',serif] text-[2.5rem] font-bold text-[#33312E]">
					Learning Modules
				</h1>
				<div class="absolute -bottom-2 left-0 h-1.5 w-full bg-[#DDB967]"></div>
			</div>

			<p
				class="mt-6 max-w-2xl font-['Work_Sans',sans-serif] leading-relaxed text-[#33312E] opacity-80"
			>
				<br />
				Explore all 9 core modules of the FSI Standard Chinese course. These materials were originally
				developed for U.S. diplomats and come with authentic vintage audio recordings from the original
				tape collection.
			</p>
		</header>

		{#if loading}
			<!-- Loading animation with spinning cassette reels -->
			<Loader />
		{:else}
			<!-- Module cards grid -->
			<div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each modules as module}
					<!-- Module card styled as vintage cassette case -->
					{@const colors = getModuleColors(module.id)}
					<a
						href="/modules/{module.id}"
						class="group relative flex h-full flex-col overflow-hidden rounded-lg border-2 border-[#33312E] bg-[#E8E5D7] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0_#826D5B]"
						style="box-shadow: inset 0 1px 20px rgba(255, 255, 255, 0.5), 2px 2px 0 #826D5B;"
					>
						<!-- Top colored binding -->
						<div class="h-3 w-full {colors.bg} border-b-2 border-[#33312E]"></div>

						<!-- Card content -->
						<div class="flex flex-grow flex-col">
							<!-- Header section with badge and title -->
							<div class="p-6">
								<div class="relative mb-3 flex gap-4">
									<!-- Module number badge -->
									<div
										class="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#33312E] {colors.bg}"
										style="transform: rotate(-5deg); box-shadow: 1px 1px 0 #826D5B;"
									>
										<span class="font-['Arvo',serif] text-xl font-bold text-[#33312E]">
											{module.id}
										</span>
									</div>

									<!-- Title next to badge -->
									<h2
										class="flex-1 self-center font-['Arvo',serif] text-xl font-semibold text-[#33312E] transition-colors group-hover:text-[#C17C74]"
									>
										{module.title}
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
											<line
												x1="9.5"
												y1="12"
												x2="14.5"
												y2="12"
												stroke="#33312E"
												stroke-width="1.5"
											/>
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
												style="transition: width 0.3s ease-out; background-color: {colors.accent}; opacity: 0.8;"
											></div>
											<!-- Tick marks -->
											<div
												class="pointer-events-none absolute top-0 left-12 flex h-full w-full justify-between px-1"
											>
												{#each Array(4) as _, i}
													<span class="mt-1 h-1 w-px bg-[#33312E] opacity-40"></span>
												{/each}
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
								<p
									class="line-clamp-3 font-['Work_Sans',sans-serif] text-sm leading-relaxed text-[#33312E]"
								>
									{module.description}
								</p>
							</div>

							<!-- Call to action styled as a mechanical button -->
							<div
								class="border-t-2 border-[#33312E] p-3 text-right"
								style="background: repeating-linear-gradient(45deg, {colors.accent}10, {colors.accent}10 10px, transparent 10px, transparent 20px);"
							>
								<span
									class="inline-flex items-center rounded-full border border-[#33312E] bg-[#F4F1DE] px-4 py-1.5 text-sm font-medium text-[#33312E] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[2px_2px_0_#826D5B] active:translate-y-0.5 active:shadow-none"
									style="box-shadow: 1px 1px 0 #826D5B; transition: all 0.15s ease-out;"
								>
									Start learning
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
				{/each}
			</div>
		{/if}
	</section>
</div>
