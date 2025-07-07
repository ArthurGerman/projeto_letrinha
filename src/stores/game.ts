import { writable } from 'svelte/store';
import { palavras } from '../palavras';

function escolherPalavraAleatoria() {
		const indiceAleatorio = Math.floor(Math.random() * palavras.length); // Math.floor faz arredondamento de número, já o Math.random gera números aleatórios
		return palavras[indiceAleatorio];
	}

// Estado inicial
const createGameStore = () => {
    // const 
	const tentativas = Array(6).fill('').map(() => Array(5).fill(''));
	const cores = Array(6).fill('').map(() => Array(5).fill(''));

	const { subscribe, update, set } = writable({
		palavraSecreta: escolherPalavraAleatoria(),
		tentativas,
		cores,
		rodadaAtual: 0,
		jogoFinalizado: false,
		letraAtual: 0
	});

	return {
		subscribe,
		set,
		reset: () => set({
			palavraSecreta: escolherPalavraAleatoria(),
			tentativas: Array(6).fill('').map(() => Array(5).fill('')),
			cores: Array(6).fill('').map(() => Array(5).fill('')),
			rodadaAtual: 0,
			jogoFinalizado: false,
			letraAtual: 0
		}),
		update
	};
};

export const game = createGameStore();