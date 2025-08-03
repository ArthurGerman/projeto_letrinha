<script>
    import '../../styles/game.css';
    import { theme } from '../../stores/theme';
</script>

<div class="app" class:dark-theme={$theme === 'dark'}>
	<slot />
</div>