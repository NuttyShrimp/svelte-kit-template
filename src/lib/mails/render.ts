import { dev } from "$app/environment";
import { ORIGIN } from "$env/static/private";
import mjml2html from "mjml";
import type { SvelteComponent } from "svelte";
import type { create_ssr_component } from "svelte/internal";

const stripSvelteClasses = (html: string) =>
	html.replaceAll(/class="s-[\w-]+"/g, "").replaceAll(/data-svelte-h="svelte-[\w]+"/g, "");

export const renderComponent = <Props extends Record<string, unknown>>(
	component: new (...args: unknown[]) => SvelteComponent<Props>,
	props?: Props,
): { css: Record<string, unknown>; body: string } => {
	const ssrComponent = component as unknown as ReturnType<typeof create_ssr_component>;

	// when upgrading to svelte 5: https://github.com/sveltejs/svelte/issues/9377#issuecomment-1801392220
	const { html: body, css } = ssrComponent.render(props);
	return { body, css };
};

export const renderHtmlTemplate = <Props extends Record<string, unknown>>(
	component: new (...args: unknown[]) => SvelteComponent<Props>,
	props: Props,
) => {
	const { body, css } = renderComponent(component, props);
	const mjml = `
    <mjml>
      <mj-head>
        <mj-style inline="inline">
          .link-nostyle {
            color: inherit;
          }
        </mj-style>
        <mj-attributes>
          <mj-class name="background" background-color="#35465a"/>
          <mj-class name="title" font-size="20px" font-weight="bold"/>
          <mj-button background-color="#ffffff" color="#35465a" font-weight="bold"/>
          <mj-all font-family="Arial" color="#ffffff"/>
        </mj-attributes>
        <mj-style>${css.code}</mj-style>
      </mj-head>
      <mj-body>
        <mj-section mj-class="background">
          <mj-column width="75%">
              ${stripSvelteClasses(body)}
          </mj-column>

          <mj-column width="25%">
            <mj-image src="${dev ? "http" : "https"}://${ORIGIN}/logo.png" width="120px" />
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>`;

	// Render MJML to HTML
	const { html, errors } = mjml2html(mjml);
	if (errors.length > 0) console.warn(errors);

	return html;
};
