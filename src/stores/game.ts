import { writable } from 'svelte/store';
import { chooseRandomWord } from '$lib';
import { Word } from '$lib';

const word: Word = new Word(chooseRandomWord())

// Estado inicial
const createGameStore = () => {
	// const 
	
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
			palavraSecreta: new Word(chooseRandomWord()),
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