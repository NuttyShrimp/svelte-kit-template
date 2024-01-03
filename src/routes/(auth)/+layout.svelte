<script lang="ts">
  import { NavBar } from "$lib/components/nav";
  import type { LayoutData } from "./$types";

  export let data: LayoutData;
</script>

<NavBar user={data.user} />
<div class="container mx-auto px-4">
  <slot />
</div>
