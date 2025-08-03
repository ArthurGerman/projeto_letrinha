<script lang="ts">
	export let onKey: (key: string) => void = () => {};

	const keyBoard: string[][] = [
		['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
		['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', '←'],
		['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER']
	];

	function handleClick(key: string) {
		onKey(key);
	}
</script>

<table style="margin-top: 10px;">
	<tbody>
		{#each keyBoard as line, i}
			<tr class="line">
				{#each line as key, j}
					<td class="key">
						<button type="button" on:click={() => handleClick(key)}
							class={/^[A-Z]$/.test(key) || key === '←' ? 'letter' : 'letterSp'}
							>{key}</button>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
