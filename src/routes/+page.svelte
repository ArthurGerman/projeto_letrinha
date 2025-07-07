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
			<span class="material-symbols-outlined"> routine </span> <!--"routine" é o símbolo de sol/lua que importamos do Google Fonts-->
		</button>
	</div>

	<div class="menu">
		<h1>Sopa de Letrinhas</h1>

		<a class="options" href="/jogo" title="Jogar">Jogar</a>
		<br />
		<a class="options" href="/sobre" title="Sobre o jogo">Sobre</a>
	</div>
</div>
