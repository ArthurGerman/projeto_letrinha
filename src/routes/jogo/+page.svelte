<script lang="ts">
	import { onMount } from 'svelte';
	import { palavras } from '../../palavras';

	// Estado inicial do jogo
	let palavraSecreta = escolherPalavraAleatoria();
	let tentativas = Array(6)
		.fill('')
		.map(() => Array(5).fill(''));
	let cores = Array(6)
		.fill('')
		.map(() => Array(5).fill(''));
	let rodadaAtual = 0;
	let jogoFinalizado = false;
	let letraAtual = 0;

	// array com as letras do teclado virtual
	const keyBoard: string[][] = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '←'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
	];

	// Escolhe aleatoriamente uma palavra da lista
	function escolherPalavraAleatoria() {
		const indiceAleatorio = Math.floor(Math.random() * palavras.length);
		return palavras[indiceAleatorio];
	}

	// Verifica se o palpite está correto e atualiza as cores
	function verificarPalpite() {
		const palpite = tentativas[rodadaAtual].join('').toUpperCase();
		if (palpite.length !== 5) return;

		const coresDaRodada = Array(5).fill('cinza');
		const letrasSecretas = palavraSecreta.toUpperCase().split('');
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

		cores[rodadaAtual] = coresDaRodada;

		if (palpite === palavraSecreta || rodadaAtual === 5) {
			jogoFinalizado = true;
			setTimeout(() => reiniciarJogo(), 3000);
		} else {
			rodadaAtual++;
		}
	}

	// Reinicia o jogo com uma nova palavra
	function reiniciarJogo() {
		palavraSecreta = escolherPalavraAleatoria();
		tentativas = Array(6)
			.fill('')
			.map(() => Array(5).fill(''));
		cores = Array(6)
			.fill('')
			.map(() => Array(5).fill(''));
		rodadaAtual = 0;
		jogoFinalizado = false;
	}

	// teclado virtual
	function virtualKeyboard(tecla: string) {
		if (jogoFinalizado) return;

		const palpite = tentativas[rodadaAtual].join('').toUpperCase();
		const linha = [...tentativas[rodadaAtual]];

		if (tecla === 'ENTER') {
			verificarPalpite();
			return;
		}

		if (tecla === '←') {
			const ultimoPreenchido = linha.findLastIndex((l) => l !== '');
			if (ultimoPreenchido >= 0) {
				linha[ultimoPreenchido] = '';
				tentativas[rodadaAtual] = linha;
				tentativas = [...tentativas];
				letraAtual = ultimoPreenchido;
			}
			return;
		}

		if (/^[A-Z]$/.test(tecla)) {
			const proxima = linha.findIndex((l) => l === '');
			if (proxima !== -1) {
				linha[proxima] = tecla;
				tentativas[rodadaAtual] = linha;
				tentativas = [...tentativas];
				letraAtual = proxima + 1 < 5 ? proxima + 1 : 4;
			}
		}
	}

	// detecta o teclado
	onMount(() => {
		const handleKey = (e: KeyboardEvent) => {
			if (jogoFinalizado) return;

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
			{#each tentativas as linha, i}
				<tr>
					{#each linha as letra, j}
						<td
							class="bloco {cores[i][j]} {i === rodadaAtual && j === letraAtual
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
	{#if jogoFinalizado}
		<p>
			{tentativas[rodadaAtual].join('') === palavraSecreta
				? 'Você acertou!'
				: `A palavra era: ${palavraSecreta}`}
			<br />
			Nova palavra em 3 segundos...
		</p>
	{/if}
</div>
