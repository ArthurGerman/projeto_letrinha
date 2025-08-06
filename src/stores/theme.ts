import { writable } from 'svelte/store';

let initialtheme: 'light' | 'dark' = 'light';

if (typeof localStorage !== 'undefined') {
	const save = localStorage.getItem('theme');
	if (save === 'dark') {
		initialtheme = 'dark';
	}
}

export const theme = writable<'light' | 'dark'>(initialtheme);

theme.subscribe((value) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('theme', value);
	}
});

