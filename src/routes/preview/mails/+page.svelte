<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc";

  let selectedTemplate: string = "";
  let templateType: "svelte" | "text" = "svelte";

  $: template = trpc.dev.mailRender.query(
    {
      template: selectedTemplate,
      type: templateType,
    },
    {
      enabled: selectedTemplate != "",
    },
  );
</script>

<div class="p-4 flex gap-2">
  <label for="template">Template name</label>
  <select name="template" bind:value={selectedTemplate}>
    {#each Object.keys($page.data.templates) as template}
      <option value={template}>{template}</option>
    {/each}
  </select>
  {#if $page.data?.templates?.[selectedTemplate]}
    <label for="type">Template type</label>
    <select name="type" bind:value={templateType}>
      {#each Object.keys($page.data.templates[selectedTemplate]) as type}
        {#if $page.data.templates[selectedTemplate][type]}
          <option value={type}>{type}</option>
        {/if}
      {/each}
    </select>
  {/if}
</div>
<hr class="py-2" />
<div class="flex justify-center items-center">
  {#if $template.isSuccess}
    {@html $template.data}
  {:else if $template.isError}
    <p>Error: {$template.error.message}</p>
  {:else}
    <p>Loading...</p>
  {/if}
</div>
