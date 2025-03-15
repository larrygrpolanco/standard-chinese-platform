<script>
	export let message = 'Under Construction';
	export let submessage = "We're recording more content";
</script>

<div class="construction-container">
	<div class="cassette-wrapper">
		<div class="cassette">
			<div class="cassette-body">
				<div class="label">
					<span class="tape-title">{message}</span>
				</div>
				<div class="tape-window">
					<div class="reel left-reel"></div>
					<div class="tape-line"></div>
					<div class="reel right-reel"></div>
				</div>
				<div class="tape-details">
					<div class="tape-text">{submessage}</div>
					<div class="tape-notches">
						<div class="notch"></div>
						<div class="notch"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.construction-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		margin: 2rem auto;
		max-width: 500px;
	}

	.cassette-wrapper {
		animation: slight-wobble 5s ease-in-out infinite;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
	}

	.cassette {
		position: relative;
		width: 280px;
		height: 180px;
		margin: 0 auto;
	}

	.cassette-body {
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #c17c74; /* Terracotta */
		border-radius: 10px;
		box-shadow:
			inset 0 2px 0 rgba(255, 255, 255, 0.2),
			inset 0 -2px 0 rgba(0, 0, 0, 0.2);
		overflow: hidden;
		padding: 12px;
	}

	.label {
		background-color: #f4f1de; /* Cream Paper */
		height: 60px;
		width: 100%;
		border-radius: 4px;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: inset 0 1px 3px rgba(51, 49, 46, 0.1);
		border: 1px solid #a0998a; /* Warm Gray */
	}

	.tape-title {
		font-family: 'Arvo', 'DM Serif Display', serif;
		color: #33312e; /* Charcoal */
		font-size: 1.25rem;
		font-weight: bold;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.tape-window {
		margin-top: 12px;
		background-color: #33312e;
		border-radius: 4px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 30px;
		position: relative;
	}

	.reel {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: #e8e5d7; /* Beige */
		position: relative;
		border: 6px solid #a0998a; /* Warm Gray */
		overflow: hidden;
	}

	.reel::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 20px;
		height: 2px;
		background-color: #33312e;
		transform-origin: center;
	}

	.left-reel {
		animation: spin 4s linear infinite;
	}

	.left-reel::before {
		transform: translate(-50%, -50%) rotate(45deg);
	}

	.right-reel {
		animation: spin 4s linear infinite reverse;
	}

	.right-reel::before {
		transform: translate(-50%, -50%) rotate(-45deg);
	}

	.tape-line {
		position: absolute;
		height: 3px;
		width: 60%;
		background-color: #ddb967; /* Gold */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1;
		border-radius: 2px;
		opacity: 0.8;
	}

	.tape-details {
		margin-top: 12px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tape-text {
		font-family: 'Work Sans', sans-serif;
		color: #f4f1de; /* Cream Paper */
		font-size: 0.875rem;
		font-style: italic;
	}

	.tape-notches {
		display: flex;
		gap: 8px;
	}

	.notch {
		width: 12px;
		height: 12px;
		background-color: #33312e;
		border-radius: 50%;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes slight-wobble {
		0%,
		100% {
			transform: rotate(-1deg);
		}
		50% {
			transform: rotate(1deg);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.cassette {
			width: 240px;
			height: 160px;
		}

		.tape-title {
			font-size: 1rem;
		}

		.tape-text {
			font-size: 0.75rem;
		}
	}
</style>

