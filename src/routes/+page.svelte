<script lang="ts">
	import '../styles/global.css';
	import { tema } from '../stores/tema';

	function mudarTema() {
		tema.update((t) => (t === 'light' ? 'dark' : 'light'));
	}
</script>

<div class="container">
	<div class="theme">
		<button title="Mudar tema" id="muda_tema" on:click={mudarTema}>
			<span class="material-symbols-outlined"> routine </span>
		</button>
	</div>

	<div class="menu">
		<h1>Sopa de Letrinhas</h1>

		<br />
		<a class="options" href="/jogo">Jogar</a>
		<br />
		<a class="options" href="/sobre">Sobre</a>
	</div>
</div>
