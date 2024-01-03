<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import type { User } from "lucia";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { cn } from "$lib/utils";
  import { ViewVertical } from "radix-icons-svelte";
  import { LightSwitch } from "$lib/components/light-switch";
  import { navEntries } from "./items";
  import * as Sheet from "$lib/components/ui/sheet";
  import NavbarLink from "./NavbarLink.svelte";

  export let user: User;
  let open = false;

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", {
      method: "GET",
      redirect: "follow",
    });
  };

  const baseClass =
    "container px-4 justify-between items-center h-12 w-screen border-b border-b-zinc-800";
  const applicationName = "Student Kick-Off";
</script>

<div class={cn(baseClass, "sm:flex hidden")}>
  <div class="flex items-center gap-2">
    <a href="/">
      <img class="max-w-8 max-h-8" alt={"SKO logo"} src={"/logo.png"} />
    </a>
    <span class="font-bold">{applicationName}</span>
    <DropdownMenu.Root>
      {#each navEntries as entry}
        {#if entry.href}
          <Button href={entry.href} size="sm" variant="ghost">
            {entry.title}
          </Button>
        {:else if entry.items?.length}
          <DropdownMenu.Trigger asChild let:builder>
            <Button builders={[builder]} size="sm" variant="ghost">
              {entry.title}
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-32">
            {#each entry.items as subRoute}
              <DropdownMenu.Item href={subRoute.href}>
                {subRoute.title}
              </DropdownMenu.Item>
            {/each}
          </DropdownMenu.Content>
        {/if}
      {/each}
    </DropdownMenu.Root>
  </div>
  <div class="flex items-center gap-2">
    <LightSwitch />
    <p class="text-xs">
      Welcome {user.firstName}
      {user.lastName}
    </p>
    <form method="post" action="/api/auth/logout">
      <Button
        size="sm"
        type="submit"
        variant="outline"
        on:click={handleSignOut}
      >
        Sign out
      </Button>
    </form>
  </div>
</div>

<div class={cn(baseClass, "flex sm:hidden")}>
  <div class="flex items-center gap-2">
    <a href="/">
      <img class="max-w-8 max-h-8" alt={"SKO logo"} src={"/logo.png"} />
    </a>
    <span class="font-bold">{applicationName}</span>
  </div>
  <div class="flex items-center gap-2">
    <LightSwitch />
    <Sheet.Root bind:open>
      <Sheet.Trigger let:builder>
        <Button builders={[builder]} variant="ghost" size="icon">
          <ViewVertical />
        </Button>
      </Sheet.Trigger>
      <Sheet.Content side={"left"}>
        <NavbarLink href={"/"} bind:open class="flex items-center">
          <img
            class="w-6 h-6 object-contain mr-2"
            alt={"SKO logo"}
            src={"/logo.png"}
          />
          <span class="font-bold">{applicationName}</span>
        </NavbarLink>
        <div class="my-4 h-[calc(100vh-6rem)] pb-6 pl-6 overflow-auto">
          <div class="flex flex-col space-y-3">
            {#each navEntries as navItem}
              <div class="flex flex-col space-y-2">
                <h4 class="font-medium">{navItem.title}</h4>
                {#if navItem?.items?.length}
                  {#each navItem.items as item}
                    {#if item.href}
                      <NavbarLink
                        href={item.href}
                        bind:open
                        class="text-muted-foreground"
                      >
                        {item.title}
                      </NavbarLink>
                    {/if}
                  {/each}
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </Sheet.Content>
    </Sheet.Root>
  </div>
</div>
