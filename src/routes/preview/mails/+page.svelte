<script lang="ts">
  import { page } from "$app/stores";
  import { Combobox, type ComboBoxOption } from "$lib/components/combobox";
  import { trpc } from "$lib/trpc";

  let selectedTemplate: string = $page.url.searchParams.get("template") ?? "";
  let selectedTemplateType: "svelte" | "text" = "svelte";

  let templateProps: Record<string, unknown> = JSON.parse(
    $page.url.searchParams.get("props") ?? "{}",
  );

  $: template = trpc.dev.mailRender.query(
    {
      template: selectedTemplate,
      type: selectedTemplateType,
      props: templateProps,
    },
    {
      enabled: selectedTemplate != "",
    },
  );

  $: templateOptions = Object.keys($page.data.templates).map((templ) => ({
    value: templ,
    label: templ,
  }));

  $: templateTypeOptions = $page.data.templates?.[selectedTemplate]
    ? Object.keys($page.data.templates[selectedTemplate]).reduce<
        ComboBoxOption[]
      >((options, type) => {
        if ($page.data.templates[selectedTemplate][type]) {
          options.push({
            value: type as "svelte" | "text",
            label: type,
          });
        }
        return options;
      }, [])
    : [];
</script>

<div class="p-4 flex gap-2">
  <Combobox
    placeholder="Choose a template"
    bind:value={selectedTemplate}
    options={templateOptions}
  />
  {#if $page.data?.templates?.[selectedTemplate]}
    <Combobox
      placeholder="Choose a render type"
      bind:value={selectedTemplateType}
      options={templateTypeOptions}
    />
  {/if}
</div>
<hr class="my-2" />
<div class="flex justify-center items-center not-prose">
  {#if $template.isSuccess}
    {@html $template.data.startsWith("<")
      ? $template.data
      : `<pre>${$template.data}</pre>`}
  {:else if $template.isError}
    <p>Error: {$template.error.message}</p>
  {:else}
    <p>Loading...</p>
  {/if}
</div>
