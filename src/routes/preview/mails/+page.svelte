<script lang="ts">
  import { page } from "$app/stores";
  import { trpc } from "$lib/trpc";
  import {
    Autocomplete,
    type PopupSettings,
    type AutocompleteOption,
    popup,
  } from "@skeletonlabs/skeleton";

  let selectedTemplate: string = $page.url.searchParams.get("template") ?? "";
  let selectedTemplateType: "svelte" | "text" = "svelte";

  let templateProps: Record<string, unknown> = JSON.parse(
    $page.url.searchParams.get("props") ?? "{}",
  );

  let templatePopupSettings: PopupSettings = {
    event: "focus-click",
    target: "popupTemplateOptions",
    placement: "bottom",
  };

  let typePopupSettings: PopupSettings = {
    event: "focus-click",
    target: "popupTemplateTypeOptions",
    placement: "bottom",
  };

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

  $: templateOptions = Object.keys($page.data.templates).map<
    AutocompleteOption<string>
  >((templ) => ({
    value: templ,
    label: templ,
  }));

  $: templateTypeOptions = $page.data.templates?.[selectedTemplate]
    ? Object.keys($page.data.templates[selectedTemplate]).map<
        AutocompleteOption<"svelte" | "text">
      >((type) => ({
        value: type as "svelte" | "text",
        label: type,
      }))
    : [];

  const onTemplateSelect = (e: CustomEvent<AutocompleteOption<string>>) => {
    selectedTemplate = e.detail.value;
  };

  const onTemplateTypeSelect = (
    e: CustomEvent<AutocompleteOption<"svelte" | "text">>,
  ) => {
    selectedTemplateType = e.detail.value;
  };
</script>

<div class="p-4 flex gap-2">
  <div class="max-w-sm w-full">
    <input
      class="input autocomplete"
      type="search"
      name="autocomplete-template"
      bind:value={selectedTemplate}
      placeholder="Mail Template"
      use:popup={templatePopupSettings}
    />
    <div
      data-popup="popupTemplateOptions"
      class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
      tabindex="-1"
    >
      <Autocomplete
        bind:input={selectedTemplate}
        options={templateOptions}
        on:selection={onTemplateSelect}
      />
    </div>
  </div>

  {#if $page.data?.templates?.[selectedTemplate]}
    <div class="max-w-sm w-full">
      <input
        class="input autocomplete"
        type="search"
        name="autocomplete-template-type"
        bind:value={selectedTemplateType}
        placeholder="Template type"
        use:popup={typePopupSettings}
      />
      <div
        data-popup="popupTemplateTypeOptions"
        class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
        tabindex="-1"
      >
        <Autocomplete
          bind:input={selectedTemplateType}
          options={templateTypeOptions}
          on:selection={onTemplateTypeSelect}
        />
      </div>
    </div>
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
