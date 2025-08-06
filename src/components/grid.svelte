<script lang="ts">
	export let attempts: string[][];
	export let colors: string[][];
	export let currentLetter: number;
	export let currentRound: number;
</script>

<table style="margin-top: 10px;">
	<tbody>
		{#each attempts as line, i}
			<tr>
				{#each line as letter, j}
					<td
						class="block {colors[i][j]} {i === currentRound && j === currentLetter
							? 'current_block'
							: ''}"
					>
						<span>{letter}</span>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
