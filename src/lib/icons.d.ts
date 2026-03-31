declare module "~icons/*" {
	import type { SvelteComponent } from "svelte";

	const component: new (...args: any[]) => SvelteComponent;
	export default component;
}
