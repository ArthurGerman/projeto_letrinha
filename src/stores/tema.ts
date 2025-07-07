import { writable } from 'svelte/store';

let temaInicial: 'light' | 'dark' = 'light';

if (typeof localStorage !== 'undefined') {
	const salvo = localStorage.getItem('tema');
	if (salvo === 'dark') {
		temaInicial = 'dark';
	}
}

export const tema = writable<'light' | 'dark'>(temaInicial);

tema.subscribe((valor) => {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem('tema', valor);
	}
});

