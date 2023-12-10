import { getMailContent } from "$lib/mails";
import { publicProcedure, router } from "$lib/server/trpc";
import { z } from "zod";

export const mailDevRouter = router({
  mailRender: publicProcedure.input(z.object({ template: z.string(), type: z.enum(["svelte", "text"]) })).query(({ input }) => {
    return getMailContent(input.type, input.template, {});
  }),
})
