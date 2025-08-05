import { writable } from 'svelte/store';
import { chooseRandomWord } from '$lib';
import { Word } from '$lib';
import type { GameState, GameStore } from '$lib/type';

const createGameStore = () => {
	const word: Word = new Word(chooseRandomWord());

    const novoGrid = () => Array(6).fill(null).map(() => Array(5).fill(''));

    const { subscribe, update, set } = writable<GameState>({
        secretWord: [word],
        attempts: [novoGrid()],
        colors: [novoGrid()],
        currentRound: [0],
        currentLetter: [0],
        gameFinished: [false]
    });

    return {
        subscribe,
        set,
        reset: () => set({
            secretWord: [new Word(chooseRandomWord())],
            attempts: [novoGrid()],
            colors: [novoGrid()],
            currentRound: [0],
            currentLetter: [0],
            gameFinished: [false]
        }),
        update
    };
};

export const game: GameStore = createGameStore();