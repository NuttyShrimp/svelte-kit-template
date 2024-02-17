<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import coverImage from '$lib/assets/images/cover-image.jpg';
	import { goto } from '$app/navigation';
</script>

<div class="flex h-screen items-center justify-center">
	<div class="hidden h-full flex-1 border-r border-r-gray-500 lg:flex">
		<img class="m-0 object-cover" alt="cover" src={coverImage} />
	</div>
	<div class="flex-1 p-2 lg:p-8">
		<div class="mx-auto flex w-full flex-col items-center justify-center sm:w-[350px]">
			<img class="w-16" alt="SKO logo" src="/logo.png" />
			<div class="text-center">
				<h2 class="m-0">Student Kick-Off</h2>
				<p class="text-muted-foreground">
					Welcome to this Student Kick-Off application. It seems like you need to login to access
					this juicy data
				</p>
			</div>
			<div>
				<Button on:click={() => goto('/login')} size="lg">Sign in with office365</Button>
			</div>
		</div>
	</div>
</div>
