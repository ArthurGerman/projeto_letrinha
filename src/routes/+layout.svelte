<script lang="ts">
	import { tema } from '../stores/tema';
	import { audioRef } from '../stores/audio';
	import { onMount } from 'svelte';


    let audio: HTMLAudioElement;
    $: audioRef.set(audio);

    // 3 músicas que vão tocar em loop
    let musicas : string[] = ["/music/music_2.mp3","/music/music_1.mp3","/music/music_3.mp3"] // Array com os endereços das músicas
    let musica_atual = 0

    function trocar_musica() {
        musica_atual = (musica_atual + 1) % musicas.length;
        audio.src = musicas[musica_atual];
        audio.play().catch(() => {});
    }

    // Inicia a música quando o componente é montado
	onMount(() => {
        if (audio) {
            audio.src = musicas[musica_atual]
            audio.muted = false; // inicia mutado para autoplay funcionar
            audio.volume = 1;
            audio.play().catch(() => {})
            audio.onended = trocar_musica;
        }
    });
</script>

<audio bind:this={audio} preload="auto"></audio>


<div class:dark-theme={$tema === 'dark'}>
	<slot />
</div>