<script lang="ts">
	// ==============================================
	// 1. IMPORTS
	// ==============================================

	//importa o estado inicial
	import { dueto } from '../../stores/dueto';
	import Grid from '../../components/grid.svelte';
	import Keyboard from '../../components/keyboard.svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	function verificarPalpiteDueto() {
		let restart = false;

		dueto.update((state) => {
			const rodada = state.currentRound[0];
			console.log(state.secretWord[0].word, state.secretWord[1].word);
			for (let p = 0; p < 2; p++) {
				if (state.gameFinished[p]) continue;

				const palpite = state.attempts[p][rodada].join('').toUpperCase();
				if (palpite.length !== 5) continue;

				const palavraSecreta = state.secretWord[p].word.toUpperCase();
				const letrasSecretas = palavraSecreta.split('');
				const coresDaRodada = Array(5).fill('cinza');
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

				state.colors[p][rodada] = coresDaRodada;

				if (palpite === palavraSecreta) {
					state.gameFinished[p] = true;
				}
			}

			if (state.gameFinished[0] && state.gameFinished[1]) {
				restart = true;
			} else if (rodada < 5) {
				state.currentRound = [rodada + 1, rodada + 1];
				state.currentLetter = [0, 0];
			} else {
				state.gameFinished = [true, true];

				restart = true;
			}

			return state;
		});

		if (restart) {
			setTimeout(() => dueto.reset(), 3000);
		}
	}

	function virtualKeyboard(tecla: string) {
		dueto.update((state) => {
			const rodada = state.currentRound[0];
			if (rodada >= 6) return state;

			// ENTER → verifica palpite
			if (tecla === 'ENTER') {
				verificarPalpiteDueto();
				return state;
			}

			// BACKSPACE → apaga apenas nas grids ainda ativas
			if (tecla === '←') {
				for (let p = 0; p < 2; p++) {
					if (state.gameFinished[p]) continue;
					const linha = [...state.attempts[p][rodada]];
					const idx = linha.findLastIndex((l) => l !== '');
					if (idx >= 0) {
						linha[idx] = '';
						state.attempts[p][rodada] = linha;
						state.currentLetter[p] = idx;
					}
				}
				return state;
			}

			// Letras → insere apenas nas grids ainda ativas
			if (/^[A-Z]$/.test(tecla)) {
				for (let p = 0; p < 2; p++) {
					if (state.gameFinished[p]) continue;
					const linha = [...state.attempts[p][rodada]];
					const pos = linha.findIndex((l) => l === '');
					if (pos !== -1) {
						linha[pos] = tecla;
						state.attempts[p][rodada] = linha;
						state.currentLetter[p] = pos + 1;
					}
				}
			}

			return state;
		});
	}

	onMount(() => {
		const handleKey = (e: KeyboardEvent) => {
			const state = get(dueto);
			if (state.gameFinished[0] && state.gameFinished[1]) return;

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

	<!-- Geração da grade de attempts -->
	<div style="display: flex; gap: 15px;">
		<Grid attempts={$dueto.attempts[0]} colors={$dueto.colors[0]} />
		<Grid attempts={$dueto.attempts[1]} colors={$dueto.colors[1]} />
	</div>

	<!-- teclado virtual -->
	<Keyboard onKey={virtualKeyboard} />

	<!-- Exibe mensagem final quando o jogo termina -->
	{#if $dueto.gameFinished[0] && $dueto.gameFinished[1]}
		<p id="jogo_finalizado">
			{$dueto.attempts[0][$dueto.currentRound[0]].join('') === $dueto.secretWord[0].word &&
			$dueto.attempts[1][$dueto.currentRound[1]].join('') === $dueto.secretWord[1].word
				? 'Você acertou!'
				: `As palavras eram: ${$dueto.secretWord[0].word} e ${$dueto.secretWord[1].word}`}
			<br />
			Nova palavra em 3 segundos...
		</p>
	{/if}
</div>
