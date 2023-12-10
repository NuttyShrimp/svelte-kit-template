import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../../login/$types";
import { loadedTemplates } from "$lib/mails";

export const load: PageServerLoad = async () => {
  if (!dev) throw redirect(301, "/");
  return {
    templates: loadedTemplates
  }
}
