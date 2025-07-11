<script lang="ts">
	import { tema } from '../stores/tema';
	import { audioRef } from '../stores/audio';
	import { onMount } from 'svelte';


    let audio: HTMLAudioElement;
    $: audioRef.set(audio);


    // Inicia a música quando o componente é montado
	onMount(() => {
        if (audio) {
            audio.muted = false; // inicia mutado para autoplay funcionar
            audio.volume = 1;
            audio.play().catch(() => {});
        }
    });
</script>

<audio bind:this={audio} src="/musica.mp3" preload="auto" loop></audio>


<div class:dark-theme={$tema === 'dark'}>
	<slot />
</div>