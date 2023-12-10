<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc";

  let selectedTemplate = "";
  let templateType: "svelte" | "text" = "svelte";

  const template = trpc.dev.mailRender.query({
    type: templateType,
    template: selectedTemplate,
  });
</script>

<div style="display: flex; gap: .5rem;">
  <select name="template" bind:value={selectedTemplate}>
    {#each Object.keys($page.data.templates) as template}
      <option value={template}>{template}</option>
    {/each}
  </select>
  {#if $page.data?.templates?.[selectedTemplate]}
    <select name="type" bind:value={templateType}>
      {#each Object.keys($page.data.templates[selectedTemplate]) as type}
        <option value={type}>{type}</option>
      {/each}
    </select>
  {/if}
</div>
<div class="flex justify-center items-center">
  {#if $template.isSuccess}
    {@html $template.data}
  {:else if $template.isError}
    <p>Error: {$template.error.message}</p>
  {:else}
    <p>Loading...</p>
  {/if}
</div>
