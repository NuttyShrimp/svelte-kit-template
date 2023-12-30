declare module "svelte/internal" {
	export function create_ssr_component(fn: unknown): {
		render: (
			props?: {},
			{ $$slots, context }?: { $$slots?: {}; context?: Map<any, any> },
		) => { html: any; css: { code: string; map: any }; head: string };
		$$render: (result: any, props: any, bindings: any, slots: any, context: any) => any;
	};
}
