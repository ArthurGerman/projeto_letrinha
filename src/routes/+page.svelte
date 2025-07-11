<script lang="ts">
	import '../styles/global.css';
	import { tema } from '../stores/tema';
	import { audioRef, musicaLigada } from '../stores/audio';

	function mudarTema() {
		tema.update((t) => (t === 'light' ? 'dark' : 'light'));
	}


    function alterar_musica() {
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

</script>

<div class="container">
	<div class="theme">
		<button title="Mudo" id="musica" on:click={alterar_musica}>
			<span class="material-symbols-outlined">
				{$musicaLigada ? 'volume_up' : 'volume_off'} <!--"volume_up/volume_off" são os dois ícones de volumes que utilizamos aqui para a função de tocar música-->
			</span>
		</button>

		<button title="Mudar tema" id="muda_tema" on:click={mudarTema}>
			<span class="material-symbols-outlined">{$tema === 'light' ? 'dark_mode' : 'routine'}</span> <!--"routine" é o símbolo de sol e "dark_mode" é a lua. Ambos nós importamos através de uma API do Google Icons-->
		</button>
	</div>

	<div class="menu">
		<h1>Sopa de Letrinhas</h1>

		<a class="options" href="/jogo" title="Jogar">Jogar</a>
		<br />
		<a class="options" href="/sobre" title="Sobre o jogo">Sobre</a>
	</div>
</div>
