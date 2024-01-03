<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import type { User } from "lucia";

  export let user: User;

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", {
      method: "GET",
      redirect: "follow",
    });
  };
</script>

<div class="container px-4 flex justify-between items-center h-12 w-screen">
  <div class="flex items-center gap-2">
    <a href="/">
      <img class="max-w-8 max-h-8" alt={"SKO logo"} src={"./logo.png"} />
    </a>
    <span class="font-bold">Application Name</span>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild let:builder>
        <Button builders={[builder]} size="sm" variant="ghost">List</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-32">
        <DropdownMenu.Item href="/">Test link</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
  <div class="flex items-center gap-2">
    <p class="text-xs">
      Welcome {user.firstName}
      {user.lastName}
    </p>
    <form method="post" action="/api/auth/logout">
      <Button
        type="submit"
        size="sm"
        variant="outline"
        on:click={handleSignOut}
      >
        Sign out
      </Button>
    </form>
  </div>
</div>
