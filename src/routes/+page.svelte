<script lang="ts">
	import '../styles/global.css';

	if (typeof window !== 'undefined'){
		const temaSalvo = localStorage.getItem('tema');

		if (temaSalvo == 'dark'){
			document.body.classList.add("dark-theme");
		}
	}
	function mudarTema(event:MouseEvent){
		event.preventDefault();
		const isDark = document.body.classList.toggle("dark-theme")
		localStorage.setItem('tema', isDark ? 'dark' : 'light');
	}
</script>

<div class="theme" style="width:100%; display:flex; justify-content: right;">
	<button title="Mudar tema" id="muda_tema" on:click={mudarTema} style="border: none; margin-right:30px; margin-top:20px">
		<span class="material-symbols-outlined">
			routine
		</span>
	</button>
</div>
<div class="container">
	<h1>Sopa de Letrinhas</h1>

	<br />
	<a class="menu" href="/jogo">Jogar</a>
	<br />
	<a class="menu" href="/sobre">Sobre</a>
</div>
