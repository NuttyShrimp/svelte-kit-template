<script lang="ts">
  import "../app.pcss";
  import { trpc } from "$lib/trpc";
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from "@floating-ui/dom";
  import { storePopup, autoModeWatcher } from "@skeletonlabs/skeleton";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  $: queryClient = trpc.hydrateFromServer(data.trpc);
</script>

<svelte:head>{@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}</svelte:head>

<QueryClientProvider client={queryClient}>
  <slot />
</QueryClientProvider>
