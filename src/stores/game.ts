import { writable } from 'svelte/store';
import { chooseRandomWord } from '$lib';
import { Word } from '$lib';


// Estado inicial
const createGameStore = () => {
	// const 
	const word: Word = new Word(chooseRandomWord())
	const tentativas = Array(6).fill('').map(() => Array(5).fill(''));
	const cores = Array(6).fill('').map(() => Array(5).fill(''));

	const { subscribe, update, set } = writable({
		palavraSecreta: word,
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
			palavraSecreta: word,
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