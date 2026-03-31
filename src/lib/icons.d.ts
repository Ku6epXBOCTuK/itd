declare module "~icons/*" {
	import type { SvelteComponent } from "svelte";
	export default class extends SvelteComponent {
		$$prop_def: { size?: string | number; color?: string };
	}
}
