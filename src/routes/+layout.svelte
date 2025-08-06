<script lang="ts">
	import { theme } from '../stores/theme';
	import { audioRef } from '../stores/audio';
	import { onMount } from 'svelte';


    let audio: HTMLAudioElement;
    $: audioRef.set(audio);

    // 3 músicas que vão tocar em loop
    let music : string[] = ["/music/music_2.mp3","/music/music_1.mp3","/music/music_3.mp3"] // Array com os endereços das músicas
    let current_music = 0

    function changeMusic() {
        current_music = (current_music + 1) % music.length;
        audio.src = music[current_music];
        audio.play().catch(() => {});
    }

    // Inicia a música quando o componente é montado
	onMount(() => {
        if (audio) {
            audio.src = music[current_music]
            audio.muted = false; // inicia mutado para autoplay funcionar
            audio.volume = 1;
            audio.play().catch(() => {})
            audio.onended = changeMusic;
        }
    });
</script>

<audio bind:this={audio} preload="auto"></audio>


<div class:dark-theme={$theme === 'dark'}>
	<slot />
</div>