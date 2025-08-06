<script lang="ts">
	// ==============================================
	// 1. IMPORTS
	// ==============================================

	//importa o estado inicial
	import { dueto } from '../../stores/game';
	import Grid from '../../components/grid.svelte';
	import Keyboard from '../../components/keyboard.svelte';
	import { createKeyHandler, virtualKeyboard } from '../../lib/logic';
	import Modal from '../../components/message.svelte';

	const handleKey = createKeyHandler(dueto);

	console.log($dueto.secretWord[0].word, $dueto.secretWord[1].word);
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
	<Keyboard onKey={(k: string) => virtualKeyboard(dueto, k)} />

	<!-- Exibe mensagem final quando o jogo termina -->
	<Modal store={dueto} />
</div>
