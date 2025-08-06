import { writable, type Writable } from 'svelte/store';
import { chooseRandomWord } from '$lib';
import { Word } from '$lib';
import type { GameState, GameStore } from '$lib/type';

const createGrid = () => Array(6).fill(null).map(() => Array(5).fill(''));

function createGameStore(wordsCount: number): GameStore {
    const store: Writable<GameState> = writable({
        secretWord: Array.from({ length: wordsCount }, () => new Word(chooseRandomWord())),
        attempts: Array.from({ length: wordsCount }, () => createGrid()),
        colors: Array.from({ length: wordsCount }, () => createGrid()),
        currentRound: 0,
        currentLetter: Array(wordsCount).fill(0),
        gameFinished: Array(wordsCount).fill(false)
    });

    return {
        ...store,
        reset: () => {
            store.set({
                secretWord: Array.from({ length: wordsCount }, () => new Word(chooseRandomWord())),
                attempts: Array.from({ length: wordsCount }, () => createGrid()),
                colors: Array.from({ length: wordsCount }, () => createGrid()),
                currentRound: 0,
                currentLetter: Array(wordsCount).fill(0),
                gameFinished: Array(wordsCount).fill(false)
            });
        }
    };
}

export const game: GameStore = createGameStore(1);
export const dueto: GameStore = createGameStore(2);
