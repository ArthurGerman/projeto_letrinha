<script lang="ts">
	import type { GameStore } from '$lib/type';
	export let store: GameStore;

	$: acertouTudo = $store.secretWord.every((w) => w.varifyword());

	function formatarPalavras(palavras: string[]): string {
		if (palavras.length === 1) return palavras[0];
		if (palavras.length === 2) return palavras.join(' e ');
		return palavras.slice(0, -1).join(', ') + ' e ' + palavras.at(-1);
	}

	$: palavrasCorretas = formatarPalavras($store.secretWord.map((w) => w.word));
	$: textoPalavra = $store.secretWord.length > 1 ? 'As palavras eram' : 'A palavra era';

	let contador = 3;

  $: if ($store.gameFinished.every((f) => f)) {
    contador = 3;
    iniciarContagem();
  }

  function iniciarContagem() {
    if (contador > 1) {
      setTimeout(() => {
        contador--;
        iniciarContagem(); // 🔄 chama de novo até chegar a 1
      }, 1000);
    }
  }
</script>

{#if $store.gameFinished.every((f) => f)}
	<div class="modal-overlay">
		<div class="modal-content">
			{acertouTudo ? '🎉 Você acertou!' : `❌ ${textoPalavra}: ${palavrasCorretas}`}
			<br />
			Nova palavra em {contador} segundos...
		</div>
	</div>
{/if}
