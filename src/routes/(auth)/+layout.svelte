<script lang="ts">
	import { Navbar } from '$lib/components/nav';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<Navbar user={data.user} />
<div class="container mx-auto p-4">
	<slot />
</div>
