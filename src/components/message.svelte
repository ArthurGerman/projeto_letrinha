<script lang="ts">
	import type { GameStore } from '$lib/type';
	export let store: GameStore;

	$: allCorrect = $store.secretWords.every((w) => w.varifyword());

	function formatWords(words: string[]): string {
		if (words.length === 1) return words[0];
		if (words.length === 2) return words.join(' e ');
		return words.slice(0, -1).join(', ') + ' e ' + words.at(-1);
	}

	$: correctWords = formatWords($store.secretWords.map((w) => w.word));
	$: textWord = $store.secretWords.length > 1 ? 'As palavras eram' : 'A palavra era';

	let counter = 3;
	let timer: ReturnType<typeof setInterval>;

	$: if ($store.gameFinisheds.every((f) => f)) {
		counter = 3;
		startCounting();
	}

	function startCounting() {
		timer = setInterval(() => {
			counter--;

			if (counter == 0) {
				clearInterval(timer);
			}
		}, 1000);
	}
</script>

{#if $store.gameFinisheds.every((f) => f)}
	<div class="modal-overlay">
		<div class="modal-content">
			{allCorrect ? '🎉 Você acertou!' : `❌ ${textWord}: ${correctWords}`}
			<br />
			Nova palavra em {counter} segundos...
		</div>
	</div>
{/if}
