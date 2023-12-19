import { getMailContent } from "$lib/mails";
import { publicProcedure, router } from "$lib/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const mailDevRouter = router({
  mailRender: publicProcedure
    .input(z.object({ template: z.string(), type: z.enum(["svelte", "text"]), props: z.record(z.string(), z.unknown()).nullish() }))
    .query(({ input }) => {
      const content = getMailContent(input.type, input.template, input.props ?? {});
      if (!content) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No mail template for ${input.template} of type ${input.type}`,
        });
      }
      return content;
    }),
});
