<script lang="ts">
  import Fa from "svelte-fa";
  import { faMicrosoft } from "@fortawesome/free-brands-svg-icons";
</script>

<div class="container px-4 mx-auto flex flex-col items-center">
  <h1 class="h1 pt-10">Login</h1>
  <div
    class="logo-cloud grid-cols-1 gap-1 [&>.logo-item]:variant-filled-secondary"
  >
    <a class="logo-item sm:px-8 px-4" href="/login/azuread">
      <span><Fa icon={faMicrosoft} /></span>
      <span>Microsoft</span>
    </a>
  </div>
</div>
