<script lang="ts">
	// ==============================================
	// 1. IMPORTS
	// ==============================================

	//importa o estado inicial
	import { game } from '../../stores/game';
	import Grid from '../../components/grid.svelte';
	import Keyboard from '../../components/keyboard.svelte';
	import { createKeyHandler, virtualKeyboard } from '../../lib/logic';

	const handleKey = createKeyHandler(game);
	
	console.log($game.secretWord[0].word)
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

	<!-- Geração da grade de tentativas -->
	<Grid attempts={$game.attempts[0]} colors={$game.colors[0]} />

	<!-- teclado virtual -->
	<Keyboard onKey={(k: string) => virtualKeyboard(game, k)} />

	<!-- Exibe mensagem final quando o jogo termina -->
	{#if $game.gameFinished[0]}
		<p id="jogo_finalizado">
			{$game.secretWord[0].varifyword($game.attempts[0][$game.currentRound[0]].join(''))
				? 'Você acertou!'
				: `A palavra era: ${$game.secretWord[0].word}`}
			<br />
			Nova palavra em 3 segundos...
		</p>
	{/if}
</div>
