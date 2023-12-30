import { dev } from "$app/environment";
import { loadedTemplates } from "$lib/mails";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "../../login/$types";

export const load: PageServerLoad = async ({ url }) => {
	if (!dev) redirect(301, "/");
	return {
		templates: loadedTemplates,
	};
};
