<script lang="ts">
	import Fa from 'svelte-fa';
	import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
</script>

<div class="container mx-auto flex flex-col items-center px-4">
	<h1 class="h1 pt-10">Login</h1>
	<div class="logo-cloud [&>.logo-item]:variant-filled-secondary grid-cols-1 gap-1">
		<a class="logo-item px-4 sm:px-8" href="/login/azuread">
			<span><Fa icon={faMicrosoft} /></span>
			<span>Microsoft</span>
		</a>
	</div>
</div>
