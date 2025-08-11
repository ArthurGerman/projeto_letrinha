import { writable, type Writable } from 'svelte/store';
import { chooseRandomWord } from '$lib';
import { Word } from '$lib';
import type { GameState, GameStore } from '$lib/type';

const createGrid = () => Array(6).fill(null).map(() => Array(5).fill(''));

function createGameStore(wordsCount: number): GameStore {
    const store: Writable<GameState> = writable({
        secretWords: Array.from({ length: wordsCount }, () => new Word(chooseRandomWord())),
        attempts: Array.from({ length: wordsCount }, () => createGrid()),
        colors: Array.from({ length: wordsCount }, () => createGrid()),
        currentRound: 0,
        currentLetters: Array(wordsCount).fill(0),
        gameFinisheds: Array(wordsCount).fill(false)
    });

    return {
        ...store,
        reset: () => {
            store.set({
                secretWords: Array.from({ length: wordsCount }, () => new Word(chooseRandomWord())),
                attempts: Array.from({ length: wordsCount }, () => createGrid()),
                colors: Array.from({ length: wordsCount }, () => createGrid()),
                currentRound: 0,
                currentLetters: Array(wordsCount).fill(0),
                gameFinisheds: Array(wordsCount).fill(false)
            });
        }
    };
}

export const game: GameStore = createGameStore(1);
export const dueto: GameStore = createGameStore(2);
export const quarteto: GameStore = createGameStore(4);
