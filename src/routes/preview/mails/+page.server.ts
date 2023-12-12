import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../../login/$types";
import { loadedTemplates } from "$lib/mails";
import { trpcServer } from "$lib/server";

export const load: PageServerLoad = async (event) => {
  if (!dev) throw redirect(301, "/");
  await trpcServer.dev.mailRender.ssr({
    template: Object.keys(loadedTemplates)[0],
    type: "svelte"
  }, event)
  return {
    templates: loadedTemplates
  }
}
