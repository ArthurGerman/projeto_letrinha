<script lang="ts">
	import { onMount, tick } from 'svelte';
	// Importa a lista de palavras possíveis para o jogo
	import { palavras } from '../../palavras';

	// Estado inicial do jogo
	let palavraSecreta = escolherPalavraAleatoria(); // palavra que o jogador deve adivinhar
	let tentativas = Array(6)
		.fill('')
		.map(() => Array(5).fill('')); // 6 tentativas de 5 letras
	let cores = Array(6)
		.fill('')
		.map(() => Array(5).fill('')); // cores das letras em cada tentativa
	let rodadaAtual = 0; // indica a linha que o jogador está digitando
	let jogoFinalizado = false; // indica se o jogo terminou

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

	// Referências dos inputs
	let refs: HTMLInputElement[][] = Array(6)
		.fill(null)
		.map(() => Array(5).fill(null));

	async function focarCampoAtual() {
		await tick();
		refs[rodadaAtual][0]?.focus();
	}

	// Chama ao montar e sempre que mudar de rodada
	onMount(focarCampoAtual);
	$: if (typeof window !== 'undefined' && rodadaAtual >= 0) {
		focarCampoAtual();
	} // reativa sempre que a rodada muda

	// Lida com a digitação de letras
	function escreverLetra(event: Event, i: number, j: number) {
		const input = event.target as HTMLInputElement;
		let letra = input.value.toUpperCase().slice(-1);
		if (!/^[A-Z]$/.test(letra)) {
			letra = '';
		}
		tentativas[i][j] = letra;

		if (letra && j < 4) {
			refs[i][j + 1]?.focus();
		}
	}

	// Verifica se o palpite está correto e atualiza as cores
	function verificarPalpite() {
		const palpite = tentativas[rodadaAtual].join('').toUpperCase();
		if (palpite.length < 5 || palpite.length > 5) return;

		const coresDaRodada = Array(5).fill('cinza');
		for (let i = 0; i < 5; i++) {
			const letra = palpite[i];
			if (letra === palavraSecreta[i]) {
				coresDaRodada[i] = 'verde';
			} else if (palavraSecreta.includes(letra)) {
				coresDaRodada[i] = 'amarelo';
			}
		}

		cores[rodadaAtual] = coresDaRodada;

		const acertou = palpite === palavraSecreta;
		const acabouTentativas = rodadaAtual === 5;

		if (acertou || acabouTentativas) {
			jogoFinalizado = true;
			setTimeout(() => reiniciarJogo(), 2000);
		} else {
			rodadaAtual++;
		}
	}

	// Reinicia o jogo com nova palavra
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

	// Permite navegação e edição com teclado
	function teclas(event: KeyboardEvent, i: number, j: number) {
		if (event.key === 'Tab' || event.key === 'Arrow') event.preventDefault();

		if (event.key === 'Enter') verificarPalpite();

		if (event.key === 'Backspace') {
			event.preventDefault();
			if (tentativas[i][j]) {
				tentativas[i][j] = '';
			} else if (j > 0) {
				refs[i][j - 1]?.focus();
				tentativas[i][j - 1] = '';
			}
		}
	}

	function virtualKeyboard(tecla: string) {
		const palpite = tentativas[rodadaAtual].join('').toUpperCase();
		if (palpite.length == 0) refs[rodadaAtual][0]?.focus();
		if (palpite.length >= 5) refs[rodadaAtual][4]?.focus();

		if (jogoFinalizado) return;

		const linha = [...tentativas[rodadaAtual]];

		if (tecla === 'ENTER') {
			verificarPalpite();
			return;
		}

		if (tecla === '←') {
			// Remove a última letra preenchida
			const ultimoPreenchido = linha.findLastIndex((l) => l !== '');

			linha[ultimoPreenchido] = '';
			tentativas[rodadaAtual] = linha;
			tentativas = [...tentativas]; // força reatividade
			// Focar no campo que acabou de ser apagado
			refs[rodadaAtual][ultimoPreenchido]?.focus();
			return;
		}

		if (/^[A-Z]$/.test(tecla)) {
			const proxima = linha.findIndex((l) => l === '');

			linha[proxima] = tecla;
			tentativas[rodadaAtual] = linha;
			tentativas = [...tentativas]; // força reatividade
			refs[rodadaAtual][proxima]?.focus();
		}
	}
</script>

<div class="container">
	<div class="top">
		<a class="button" href="/" title="Voltar">
			<span class="material-symbols-outlined">
				undo
			</span>
		</a>

		<h1>Sopa de Letrinhas</h1>
	</div>

	<br>
	<!-- Geração da grade de tentativas -->
	<table>
		<tbody>
			{#each tentativas as linha, i}
				<tr>
					{#each linha as letra, j}
						<td>
							<input
								bind:this={refs[i][j]}
								id={`input-${i}-${j}`}
								class="letra {cores[i][j]}"
								maxlength="1"
								bind:value={tentativas[i][j]}
								on:input={(e) => escreverLetra(e, i, j)}
								on:keydown={(e) => teclas(e, i, j)}
								disabled={i !== rodadaAtual || jogoFinalizado}
								on:mousedown={(e) => e.preventDefault()}
								tabindex="-1"
							/>
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>

	<br />

	<table>
		<tbody>
			{#each keyBoard as line, i}
				<tr class="line">
					{#each line as key, j}
						<td class="key">
							<button
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
