<script lang="ts">
  import "../app.pcss";
  import { trpc } from "$lib/trpc";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { ModeWatcher } from "mode-watcher";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  $: queryClient = trpc.hydrateFromServer(data.trpc);
</script>

<QueryClientProvider client={queryClient}>
  <ModeWatcher />
  <slot class="prose" />
</QueryClientProvider>
