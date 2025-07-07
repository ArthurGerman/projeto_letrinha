<script lang="ts">
	// ==============================================
	// 1. IMPORTS
	// ==============================================

	// Importa o hook 'onMount' do Svelte para executar código quando o componente é renderizado
	import { onMount } from 'svelte';

	//importa o estado inicial
	import { game } from '../../stores/game';

	// ==============================================
	// 2. ESTADOS DO JOGO (VARIÁVEIS REATIVAS)
	// ==============================================

	// array de duas dimensões com as letras do teclado virtual
	const keyBoard: string[][] = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '←'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
	];

	// ==============================================
	// 3. FUNÇÕES PRINCIPAIS
	// ==============================================

	// Verifica se o palpite está correto e atualiza as cores
	function verificarPalpite() {
		let deveReiniciar = false;

		game.update((state) => {
			const palpite = state.tentativas[state.rodadaAtual].join('').toUpperCase();
			if (palpite.length !== 5) return state;

			const coresDaRodada = Array(5).fill('cinza');
			const letrasSecretas = state.palavraSecreta.toUpperCase().split('');
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

			if (palpite === state.palavraSecreta || state.rodadaAtual === 5) {
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

	// teclado virtual
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

	// detecta o teclado
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
		<a class="button" href="/" title="Voltar">
			<span class="material-symbols-outlined"> undo </span>
		</a>

		<h1>Sopa de Letrinhas</h1>
	</div>

	<!-- Geração da grade de tentativas -->
	<table style="margin-top: 10px;">
		<tbody>
			{#each $game.tentativas as linha, i}
				<tr>
					{#each linha as letra, j}
						<td
							class="bloco {$game.cores[i][j]} {i === $game.rodadaAtual && j === $game.letraAtual
								? 'bloco-atual'
								: ''}"
						>
							<span>{letra}</span>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- teclado virtual -->
	<table style="margin-top: 10px;">
		<tbody>
			{#each keyBoard as line, i}
				<tr class="line">
					{#each line as key, j}
						<td class="key">
							<button
								type="button"
								on:click={() => virtualKeyboard(key)}
								class={/^[A-Z]$/.test(key) || key === '←' ? 'letter' : 'letterSp'}
							>
								{key}
							</button>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<!-- Exibe mensagem final quando o jogo termina -->
	{#if $game.jogoFinalizado}
		<p>
			{$game.tentativas[$game.rodadaAtual].join('') === $game.palavraSecreta
				? 'Você acertou!'
				: `A palavra era: ${$game.palavraSecreta}`}
			<br />
			Nova palavra em 3 segundos...
		</p>
	{/if}
</div>
