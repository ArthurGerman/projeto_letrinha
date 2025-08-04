<script lang="ts">
	import '../styles/global.css';
	import { theme } from '../stores/theme';
	import { audioRef, musicaLigada } from '../stores/audio';
	import { onMount } from 'svelte';

	function changeTheme() {
		theme.update((t) => (t === 'light' ? 'dark' : 'light'));
	}


    function changeMusic() {
        const audio = $audioRef;
        if (!audio) return;
        musicaLigada.update((ligada) => {
            audio.volume = 1; // Volume inicial. 0 é mutado, 1 é desmutado
            if (!ligada) {
                audio.play();
            } else {
                audio.pause();
            }
            return !ligada;
        });
    }


	//Função para buscar a quantidade de Commits já feitos do projeto. É interessante para mostrar a versão, exemplo "Versão 1.26", sendo o número 26 a quantidade de commits feitas até o momento.
	let totalCommits : number = 0;

	onMount(() => {
		fetch('/api/commits')
			.then(res => res.json())
			.then(data => totalCommits = data.total);

	});

</script>

<div class="container">
	<div class="theme">
		<button title="mute" id="audio" on:click={changeMusic}>
			<span class="material-symbols-outlined">
				{$musicaLigada ? 'volume_up' : 'volume_off'} <!--"volume_up/volume_off" são os dois ícones de volumes que utilizamos aqui para a função de tocar música-->
			</span>
		</button>

		<button title="change theme" id="select_theme" on:click={changeTheme}>
			<span class="material-symbols-outlined">{$theme === 'light' ? 'dark_mode' : 'routine'}</span> <!--"routine" é o símbolo de sol e "dark_mode" é a lua. Ambos nós importamos através de uma API do Google Icons-->
		</button>
	</div>

	<div class="menu">
		<h1>Sopa de Letrinhas</h1>

		<div id="game-buttons">
			<a class="options play" href="/game" title="play Termo">Play Termo</a>
			<br />
			<a class="options play" href="/dueto" title="play Dueto">Play Dueto</a>
			<br>

		</div>

		<a class="options" id="about" href="/about" title="about the game">About</a>
	</div>

	<p id="version"
		style="
			font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
			font-size: 15px; margin-top: 250px
		">
		
		Version 1.{totalCommits}
	</p> <!--Imprime a versão que o jogo se encontra com base na quantidade de commits feitos. A quantidade mostrada é atualizada em tempo real-->
</div>
