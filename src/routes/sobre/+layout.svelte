<script>
	import '../../styles/sobre.css';
    import { tema } from '../../stores/tema';
</script>

<div class="app" class:dark-theme={$tema === 'dark'}>
	<slot />
</div>
