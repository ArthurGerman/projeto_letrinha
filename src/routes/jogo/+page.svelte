<script lang="ts">
	// ==============================================
	// 1. IMPORTS
	// ==============================================
	
	// Importa o hook 'onMount' do Svelte para executar código quando o componente é renderizado
	import { onMount } from 'svelte';

	// Importa a lista de palavras do arquivo .ts
	import { palavras } from '../../palavras';

	// ==============================================
	// 2. ESTADOS DO JOGO (VARIÁVEIS REATIVAS)
	// ==============================================
	
	// Estado inicial
	// Palavra secreta que o jogador precisa adivinhar (escolhida aleatoriamente)
	let palavraSecreta : string = escolherPalavraAleatoria();

	// Matriz 6x5 que armazena as tentativas do jogador
	// - Array(6): cria um array com 6 posições
	// - .fill(''): preenche cada posição com string vazia
	// - .map(() => Array(5).fill('')): cria um array de 5 strings vazias para cada linha
	let tentativas = Array(6)
		.fill('')
		.map(() => Array(5).fill(''));


	// Matriz 6x5 que armazena as cores de feedback para cada letra
	// - 'cinza': letra não existe na palavra
	// - 'amarelo': letra existe mas em posição errada
	// - 'verde': letra correta na posição certa
	let cores = Array(6)
		.fill('')
		.map(() => Array(5).fill(''));


	
	let rodadaAtual : number = 0; // Controla a rodada atual (0 até 5)
	let jogoFinalizado : boolean = false; //Indica se o jogo terminou
	let letraAtual : number = 0; // Controla a posição atual da letra sendo digitada

	// array de duas dimensões com as letras do teclado virtual
	const keyBoard: string[][] = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '←'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
	];


	// ==============================================
	// 3. FUNÇÕES PRINCIPAIS
	// ==============================================

	// Escolhe aleatoriamente uma palavra da lista
	function escolherPalavraAleatoria() {
		const indiceAleatorio = Math.floor(Math.random() * palavras.length); // Math.floor faz arredondamento de número, já o Math.random gera números aleatórios
		return palavras[indiceAleatorio];
	}

	// Verifica se o palpite está correto e atualiza as cores
	function verificarPalpite() {
		const palpite = tentativas[rodadaAtual].join('').toUpperCase();
		if (palpite.length !== 5) return;

		const coresDaRodada = Array(5).fill('cinza');
		const letrasSecretas = palavraSecreta.toUpperCase().split('');
		const letrasUsadas = Array(5).fill(false); // Separa a palavra secreta em letras individuais

		for (let i = 0; i < 5; i++) { // Esse loop marca as letras corretas na posição verde
			if (palpite[i] === letrasSecretas[i]) {
				coresDaRodada[i] = 'verde';
				letrasUsadas[i] = true;
			}
		}

		for (let i = 0; i < 5; i++) { // Esse loop marca letras corretas na posição errada de amarelo
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

		cores[rodadaAtual] = coresDaRodada; // Atualiza a matriz de cores com o resultado da rodada

		// verifica se terminou o jogo ou não
		if (palpite === palavraSecreta || rodadaAtual === 5) {
			jogoFinalizado = true;
			setTimeout(() => reiniciarJogo(), 3000); // 3000 ms equivalem a 3 segundos
		} else {
			rodadaAtual++;
		}
	}

	// Reinicia o jogo com uma nova palavra
	function reiniciarJogo() {
		palavraSecreta = escolherPalavraAleatoria();
		tentativas = Array(6) // Reseta as tentativas(matriz 6x5 vazia)
			.fill('')
			.map(() => Array(5).fill(''));
		cores = Array(6) // Reseta as cores
			.fill('')
			.map(() => Array(5).fill(''));

		// Aqui reinicia os contadores
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
