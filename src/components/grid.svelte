<script lang="ts">
	export let attempts: string[][];
	export let colors: string[][];
	
</script>

<table style="margin-top: 10px;">
	<tbody>
		{#each attempts as line, i}
			<tr>
				{#each line as letter, j}
					<td
						class="bloco {colors[i][j]}">
						<span>{letter}</span>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
