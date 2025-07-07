<script lang="ts">
	import { tema } from '../stores/tema';
</script>

<div class:dark-theme={$tema === 'dark'}>
	<slot />
</div>