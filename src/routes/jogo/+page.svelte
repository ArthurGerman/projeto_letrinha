<script lang="ts">
    // Importa a lista de palavras possíveis para o jogo
    import { palavras } from '../../palavras';
    import "../../styles/jogo.css"
  
    // Escolhe aleatoriamente uma palavra da lista
    function escolherPalavraAleatoria() {
      const indiceAleatorio = Math.floor(Math.random() * palavras.length);
      return palavras[indiceAleatorio];
    }
  
    // Estado inicial do jogo
    let palavraSecreta = escolherPalavraAleatoria(); // palavra que o jogador deve adivinhar
    let tentativas = Array(6).fill("").map(() => Array(5).fill("")); // 6 tentativas de 5 letras
    let cores = Array(6).fill("").map(() => Array(5).fill("")); // cores das letras em cada tentativa
    let rodadaAtual = 0; // indica a linha que o jogador está digitando
    let jogoFinalizado = false; // indica se o jogo terminou
  
    // Verifica se o palpite está correto e atualiza as cores
    function verificarPalpite() {
      const palpite = tentativas[rodadaAtual].join("").toUpperCase(); // junta as letras da tentativa atual
  
      if (palpite.length < 5) return; // não verifica se o palpite está incompleto
  
      // Inicializa todas as cores como "cinza" (letra errada)
      const coresDaRodada = Array(5).fill("cinza");
  
      // Marca letras corretas (verde) e letras na posição errada (amarelo)
      for (let i = 0; i < 5; i++) {
        const letra = palpite[i];
  
        if (letra === palavraSecreta[i]) {
          coresDaRodada[i] = "verde"; // letra e posição correta
        } else if (palavraSecreta.includes(letra)) {
          coresDaRodada[i] = "amarelo"; // letra existe, mas está na posição errada
        }
      }
  
      // Atualiza as cores da linha atual
      cores[rodadaAtual] = coresDaRodada;
  
      // Verifica se o jogador venceu ou se acabou o número de tentativas
      const acertou = palpite === palavraSecreta;
      const acabouTentativas = rodadaAtual === 5;
  
      if (acertou || acabouTentativas) {
        jogoFinalizado = true;
  
        // Aguarda 2 segundos antes de reiniciar o jogo
        setTimeout(() => reiniciarJogo(), 2000);
      } else {
        rodadaAtual++; // passa para a próxima tentativa
      }
    }
  
    // Reinicia o jogo com nova palavra
    function reiniciarJogo() {
      palavraSecreta = escolherPalavraAleatoria();
      tentativas = Array(6).fill("").map(() => Array(5).fill(""));
      cores = Array(6).fill("").map(() => Array(5).fill(""));
      rodadaAtual = 0;
      jogoFinalizado = false;
    }
  
    // Lida com a digitação de letras
    function escreverLetra(event: Event, i: number, j: number) {
      const input = event.target as HTMLInputElement;
      const letra = input.value.toUpperCase().slice(-1); // pega apenas a última letra
      tentativas[i][j] = letra;
  
      // Se a letra foi preenchida, move o foco para o próximo campo
      if (letra && j < 4) {
        document.getElementById(`input-${i}-${j + 1}`)?.focus();
      } else if (letra && j === 4) {
        verificarPalpite(); // chama a verificação ao digitar a última letra
      }
    }
  
    // Permite navegação e edição com teclado
    function navegarTeclas(event: KeyboardEvent, i: number, j: number) {
      if (event.key === "Backspace") {
        event.preventDefault(); // impede que o campo apague automaticamente
  
        if (tentativas[i][j]) {
          // Se o campo atual tem letra, apaga
          tentativas[i][j] = "";
        } else if (j > 0) {
          // Volta para o campo anterior e apaga lá
          document.getElementById(`input-${i}-${j - 1}`)?.focus();
          tentativas[i][j - 1] = "";
        }
      }
  
      // Setas para esquerda e direita mudam o foco entre os campos
      if (event.key === "ArrowLeft" && j > 0) {
        document.getElementById(`input-${i}-${j - 1}`)?.focus();
      }
  
      if (event.key === "ArrowRight" && j < 4) {
        document.getElementById(`input-${i}-${j + 1}`)?.focus();
      }
    }
  </script>
  
  <style>
    /* Estilização dos elementos */
  
    
  </style>
  
  <!-- Título do jogo -->
  <h1>Termo Simples</h1>
  
  <!-- Geração da grade de tentativas -->
  {#each tentativas as linha, i}
    <div class="linha">
      {#each linha as letra, j}
        <input
          id={`input-${i}-${j}`}              
          class="letra {cores[i][j]}"         
          maxlength="1"                       
          bind:value={tentativas[i][j]}      
          on:input={(e) => escreverLetra(e, i, j)}  
          on:keydown={(e) => navegarTeclas(e, i, j)} 
          disabled={i !== rodadaAtual || jogoFinalizado} 
        />
      {/each}
    </div>
  {/each}
  
  <!-- Exibe mensagem final quando o jogo termina -->
  {#if jogoFinalizado}
    <p>
      {tentativas[rodadaAtual].join("") === palavraSecreta
        ? "Você acertou!"                // Mensagem de vitória
        : `A palavra era: ${palavraSecreta}`}  <!-- Mensagem de erro -->
      <br />
      Nova palavra em 3 segundos...
    </p>
  {/if}
  
  