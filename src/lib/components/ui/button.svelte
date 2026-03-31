<script lang="ts">
	interface Props {
		icon: any;
		label?: string;
		variant?: "primary" | "outline";
		onclick?: () => void;
	}

	let { icon: Icon, label, variant = "primary", onclick }: Props = $props();
</script>

<button class="btn" class:primary={variant === "primary"} class:outline={variant === "outline"} onclick={onclick}>
	<Icon class="icon" />

	{#if label}
		<span class="label">{label}</span>
	{/if}
</button>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		font-weight: 500;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.primary {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: #fff;
	}

	.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
	}

	.outline {
		background: transparent;
		color: #fff;
		border: 2px solid rgba(255, 255, 255, 0.3);
	}

	.outline:hover {
		background: rgba(255, 255, 255, 0.1);
		border-color: rgba(255, 255, 255, 0.5);
	}

	.btn:active {
		transform: translateY(0);
	}

	.label {
		display: inline-block;
	}
</style>
