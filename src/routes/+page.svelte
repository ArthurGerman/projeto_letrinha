<script lang="ts">
	import '../styles/global.css';

	function mudarTema(event:MouseEvent){
		event.preventDefault();
		document.body.classList.toggle("light-theme")
	}
</script>

<div class="container">
	<div class="theme">
		<button title="Mudar tema" id="muda_tema" on:click={mudarTema} style="border: none;">
			<span class="material-symbols-outlined">
				routine
			</span>
		</button>
	</div>
	<h1>Sopa de Letrinhas</h1>

	<br />
	<a class="menu" href="/jogo">Jogo</a>
	<br />
	<a class="menu" href="/sobre">Sobre</a>
</div>
