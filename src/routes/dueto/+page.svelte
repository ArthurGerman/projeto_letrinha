<script lang="ts">
	// ==============================================
	// 1. IMPORTS
	// ==============================================

	//importa o estado inicial
	import { dueto } from '../../stores/dueto';
	import Grid from '../../components/grid.svelte';
	import Keyboard from '../../components/keyboard.svelte';
	import { createKeyHandler, virtualKeyboard } from '../../lib/logic';

	const handleKey = createKeyHandler(dueto);

	console.log($dueto.secretWord[0].word, $dueto.secretWord[1].word)
</script>

<svelte:window on:keydown={handleKey} />
<div class="container">
	<!-- header -->
	<div class="top">
		<a class="back back-game" href="/" title="back">
			<span class="material-symbols-outlined"> undo </span>
			<!--"undo" é o símbolo de seta que importamos do Google Fonts-->
		</a>

		<h1>Sopa de Letrinhas</h1>
	</div>

	<!-- Geração da grade de attempts -->
	<div style="display: flex; gap: 15px;">
		<Grid attempts={$dueto.attempts[0]} colors={$dueto.colors[0]} />
		<Grid attempts={$dueto.attempts[1]} colors={$dueto.colors[1]} />
	</div>

	<!-- teclado virtual -->
	<Keyboard onKey={(k) => virtualKeyboard(dueto, k)} />

	<!-- Exibe mensagem final quando o jogo termina -->
	{#if $dueto.gameFinished[0] && $dueto.gameFinished[1]}
		<p id="jogo_finalizado">
			{$dueto.attempts[0][$dueto.attempts[0].length - 1].join('') === $dueto.secretWord[0].word &&
			$dueto.attempts[1][$dueto.attempts[1].length - 1].join('') === $dueto.secretWord[1].word
				? 'Você acertou!'
				: `As palavras eram: ${$dueto.secretWord[0].word} e ${$dueto.secretWord[1].word}`}
			<br />
			Nova palavra em 3 segundos...
		</p>
	{/if}
</div>
