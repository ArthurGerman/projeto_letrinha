<script>
	import '../../styles/about.css';
    import { theme } from '../../stores/theme';
</script>

<div class="app" class:dark-theme={$theme === 'dark'}>
	<slot />
</div>
