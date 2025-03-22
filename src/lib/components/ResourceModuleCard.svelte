<!-- src/lib/components/ResourceModuleCard.svelte -->
<script>
	export let module;

	function getModuleColors(moduleNumber) {
		const colors = [
			{ border: '#C17C74', bg: '#F8EBE8', accent: '#C17C74' }, // Terracotta
			{ border: '#7D8C5C', bg: '#EBEEE7', accent: '#7D8C5C' }, // Avocado
			{ border: '#DDB967', bg: '#F9F4E8', accent: '#DDB967' }, // Gold
			{ border: '#34667F', bg: '#EAF0F3', accent: '#34667F' } // Navy
		];
		return colors[(moduleNumber - 1) % colors.length];
	}

	const colors = getModuleColors(module.id);
</script>

<a
	href="/resource/{module.path}"
	class="resource-module-card"
	style="box-shadow: inset 0 1px 10px rgba(255, 255, 255, 0.3), 1px 1px 0 #826D5B;"
	aria-label="Resource Module: {module.title}"
>
	<!-- Left color bar with module icon - becomes just a strip on small screens -->
	<div class="module-number-container" style="background-color: {colors.bg};">
		<div class="tape-texture"></div>
		<div class="scan-line"></div>
		<div class="tape-icon">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect x="2" y="4" width="20" height="16" rx="2" stroke="#33312E" stroke-width="2" />
				<circle cx="7" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
				<circle cx="17" cy="12" r="2.5" stroke="#33312E" stroke-width="1.5" />
				<line x1="9.5" y1="12" x2="14.5" y2="12" stroke="#33312E" stroke-width="1.5" />
			</svg>
		</div>
	</div>

	<div class="content-container">
		<!-- Title and description section -->
		<div class="title-description-container">
			<div class="title-description-inner">
				<h3 class="module-title">{module.title}</h3>
				<p class="module-description">{module.description}</p>
			</div>
		</div>

		<!-- Tape count indicator -->
		<div class="module-meta">
			<div class="tape-count">
				<span class="tapes">{module.tapes} Tapes</span>
			</div>
			<div class="module-badge">
				{module.coreModules}
			</div>
		</div>
	</div>

	<!-- Side tape indicator -->
	<div
		class="tape-indicator"
		style="background: repeating-linear-gradient(90deg, transparent, transparent 2px, {colors.accent}20 2px, {colors.accent}20 4px);"
	></div>
</a>

<style>
	/* Resource module card styling */
	.resource-module-card {
		position: relative;
		display: flex;
		height: 4rem;
		align-items: center;
		overflow: hidden;
		border-radius: 0.5rem;
		border: 2px solid #33312e;
		background-color: #f4f1de;
		transition: all 0.2s;
	}

	.resource-module-card:hover {
		transform: translateY(-0.25rem);
		box-shadow: 3px 3px 0 #826d5b !important;
	}

	.resource-module-card:focus {
		outline: none;
		box-shadow:
			0 0 0 2px #ddb967,
			0 0 0 4px white;
	}

	/* Module number container */
	.module-number-container {
		position: relative;
		display: flex;
		height: 100%;
		width: 4rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-right: 2px solid #33312e;
		transition: width 0.3s ease;
	}

	.tape-texture {
		position: absolute;
		inset: 0;
		opacity: 0.1;
		background-image:
			linear-gradient(45deg, #33312e 25%, transparent 25%, transparent 75%, #33312e 75%, #33312e),
			linear-gradient(45deg, #33312e 25%, transparent 25%, transparent 75%, #33312e 75%, #33312e);
		background-size: 4px 4px;
		background-position:
			0 0,
			2px 2px;
	}

	.scan-line {
		position: absolute;
		top: 0;
		left: 0;
		height: 0.25rem;
		width: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		animation: scanDown 3s ease-in-out infinite;
	}

	.tape-icon {
		position: relative;
		z-index: 10;
		transition: opacity 0.3s ease;
	}

	/* Content container */
	.content-container {
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: space-between;
		padding-left: 0.75rem;
		padding-right: 0.75rem;
		overflow: hidden;
	}

	.title-description-container {
		flex-grow: 1;
		padding-right: 0.5rem;
		min-width: 0; /* Critical for text-overflow to work properly */
	}

	.title-description-inner {
		display: flex;
		flex-direction: column;
		min-width: 0; /* Critical for text-overflow to work properly */
	}

	.module-title {
		font-family: 'Arvo', serif;
		font-size: 0.875rem;
		font-weight: 500;
		color: #33312e;
		margin: 0;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.resource-module-card:hover .module-title {
		color: #c17c74;
	}

	.module-description {
		font-size: 0.75rem;
		color: rgba(51, 49, 46, 0.8);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}

	/* Module meta info */
	.module-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		flex-shrink: 0;
		transition: opacity 0.3s ease;
	}

	.tape-count {
		font-size: 0.75rem;
		font-weight: 500;
		color: #33312e;
		opacity: 0.8;
	}

	.module-badge {
		padding: 0.125rem 0.375rem;
		background-color: rgba(51, 49, 46, 0.1);
		border-radius: 0.25rem;
		font-size: 0.625rem;
		font-weight: 500;
		color: #33312e;
		white-space: nowrap;
	}

	/* Tape indicator at bottom */
	.tape-indicator {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 50%;
		height: 2px;
		background-color: rgba(51, 49, 46, 0.1);
	}

	/* Animations */
	@keyframes scanDown {
		0%,
		100% {
			transform: translateY(-100%);
		}
		50% {
			transform: translateY(100%);
		}
	}

	/* Responsive breakpoints */
	/* Extra small screens */
	@media (max-width: 360px) {
		.module-number-container {
			width: 0.7rem; /* Just a thin color strip */
			border-right-width: 1px;
		}

		.tape-icon {
			opacity: 0; /* Hide the tape icon completely */
		}

		.module-description {
			display: none; /* Hide description on very small screens */
		}

		.content-container {
			padding-left: 0.5rem;
			padding-right: 0.5rem;
		}

		.module-meta {
			max-width: 70px;
		}

		.module-badge {
			display: none; /* Hide badge on very small screens */
		}
	}

	/* Small screens (phones) */
	@media (min-width: 361px) and (max-width: 480px) {
		.module-number-container {
			width: 0.8rem; /* Thin strip */
			border-right-width: 1px;
		}

		.tape-icon {
			opacity: 0; /* Hide the tape icon */
		}

		.content-container {
			padding-left: 0.5rem;
		}

		.module-meta {
			max-width: 80px;
		}

		.tape-count {
			font-size: 0.65rem;
		}

		.module-badge {
			font-size: 0.55rem;
			padding: 0.1rem 0.25rem;
		}
	}

	/* Medium screens (tablets) */
	@media (min-width: 481px) and (max-width: 768px) {
		.module-number-container {
			width: 2.5rem; /* Slimmer but still visible */
		}

		.tape-icon svg {
			width: 18px;
			height: 18px;
		}

		.module-meta {
			max-width: 100px;
		}
	}

	/* Larger screens */
	@media (min-width: 769px) {
		.module-title,
		.module-description {
			max-width: calc(100% - 20px);
		}
	}
</style>
