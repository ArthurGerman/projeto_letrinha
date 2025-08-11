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
	<Grid store={dueto} />

	<!-- teclado virtual -->
	<Keyboard onKey={(k: string) => virtualKeyboard(dueto, k)} />

	<!-- Exibe mensagem final quando o jogo termina -->
	<Modal store={dueto} />
</div>
