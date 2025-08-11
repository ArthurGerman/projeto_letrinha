<script lang="ts">
	import type { GameStore } from '$lib/type';

	export let store: GameStore;
</script>

<div style="display: flex; gap: 10px;">
	{#each $store.secretWords as secretWord, w}
		<table style="margin-top: 10px;">
			<tbody>
				{#each $store.attempts[w] as line, i}
					<tr style="gap: 10px;">
						{#each line as letter, j}
							<td
								class="block {$store.colors[w][i][j]} {i === $store.currentRound &&
								j === $store.currentLetters[w] &&
								!$store.gameFinisheds[w]
									? 'current_block'
									: ''}"
								style="opacity: {$store.gameFinisheds[w] ? '40%' : '100%'}"
							>
								<span>{letter}</span>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	{/each}
</div>
