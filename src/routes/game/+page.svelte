<script lang="ts">
	// ==============================================
	// 1. IMPORTS
	// ==============================================

	//importa o estado inicial
	import { game } from '../../stores/game';
	import Grid from '../../components/grid.svelte';
	import Keyboard from '../../components/keyboard.svelte';
	import { onMount } from 'svelte';

	function verificarPalpite() {
		let deveReiniciar = false;

		game.update((state) => {
			console.log(state.palavraSecreta.word)
			const palpite = state.tentativas[state.rodadaAtual].join('').toUpperCase();
			if (palpite.length !== 5) return state;

			const coresDaRodada = Array(5).fill('cinza');
			const letrasSecretas = state.palavraSecreta.word.toUpperCase().split('');
			const letrasUsadas = Array(5).fill(false);

			for (let i = 0; i < 5; i++) {
				if (palpite[i] === letrasSecretas[i]) {
					coresDaRodada[i] = 'verde';
					letrasUsadas[i] = true;
				}
			}

			for (let i = 0; i < 5; i++) {
				if (coresDaRodada[i] === 'cinza') {
					for (let j = 0; j < 5; j++) {
						if (!letrasUsadas[j] && palpite[i] === letrasSecretas[j]) {
							coresDaRodada[i] = 'amarelo';
							letrasUsadas[j] = true;
							break;
						}
					}
				}
			}

			state.cores[state.rodadaAtual] = coresDaRodada;

			if (palpite === state.palavraSecreta.word || state.rodadaAtual === 5) {
				state.jogoFinalizado = true;
				deveReiniciar = true;
			} else {
				state.rodadaAtual++;
				state.letraAtual = 0;
			}

			return state;
		});

		if (deveReiniciar) {
			setTimeout(() => {
				game.reset();
			}, 3000);
		}
	}
	function virtualKeyboard(tecla: string) {
		game.update((state) => {
			if (state.jogoFinalizado) return state;

			const linha = [...state.tentativas[state.rodadaAtual]];
			const palpite = linha.join('').toUpperCase();

			if (tecla === 'ENTER') {
				verificarPalpite();
				return state;
			}

			if (tecla === '←') {
				const idx = linha.findLastIndex((l) => l !== '');
				if (idx >= 0) {
					linha[idx] = '';
					state.tentativas[state.rodadaAtual] = linha;
					state.letraAtual = idx;
				}
				return state;
			}

			if (/^[A-Z]$/.test(tecla)) {
				const proxima = linha.findIndex((l) => l === '');
				if (proxima !== -1) {
					linha[proxima] = tecla;
					state.tentativas[state.rodadaAtual] = linha;
					state.letraAtual = Math.min(proxima + 1, 4);
				}
			}

			return state;
		});
	}
	onMount(() => {
		const handleKey = (e: KeyboardEvent) => {
			if ($game.jogoFinalizado) return;

			const tecla = e.key.toUpperCase();

			if (tecla === 'BACKSPACE') {
				e.preventDefault();
				virtualKeyboard('←');
			} else if (tecla === 'ENTER') {
				e.preventDefault();
				virtualKeyboard('ENTER');
			} else if (/^[A-Z]$/.test(tecla)) {
				virtualKeyboard(tecla);
			}
		};

		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});
</script>

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
	<Grid attempts={$game.tentativas} colors={$game.cores} />

	<!-- teclado virtual -->
	<Keyboard onKey={virtualKeyboard} />

	<!-- Exibe mensagem final quando o jogo termina -->
	{#if $game.jogoFinalizado}
		<p id="jogo_finalizado">
			{$game.tentativas[$game.rodadaAtual].join('') === $game.palavraSecreta.word
				? 'Você acertou!'
				: `A palavra era: ${$game.palavraSecreta.word}`}
			<br />
			Nova palavra em 3 segundos...
		</p>
	{/if}
</div>
