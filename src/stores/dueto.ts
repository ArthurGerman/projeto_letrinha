import { writable } from 'svelte/store';
import { chooseRandomWord } from '$lib';
import { Word } from '$lib';
import type { GameState, GameStore } from '$lib/type';

const word1: Word = new Word(chooseRandomWord())
const word2: Word = new Word(chooseRandomWord())

const createDuetoStore = () => {
    const newGrid = () => Array(6).fill(null).map(() => Array(5).fill(''));

    const { subscribe, update, set } = writable<GameState>({
        secretWord: [word1, word2],
        attempts: [newGrid(), newGrid()],
        colors: [newGrid(), newGrid()],
        currentRound: [0, 0],
        currentLetter: [0, 0],
        gameFinished: [false, false],
    });

    return {
        subscribe,
        set,
        reset: () => set({
            secretWord: [new Word(chooseRandomWord()), new Word(chooseRandomWord())],
            attempts: [newGrid(), newGrid()],
            colors: [newGrid(), newGrid()],
            currentRound: [0, 0],
            currentLetter: [0, 0],
            gameFinished: [false, false],
        }),
        update
    };
};

export const dueto:GameStore = createDuetoStore();