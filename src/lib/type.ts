import type { Word } from '$lib';
import type { Writable } from 'svelte/store';

export interface GameState {
    secretWord: Word[];
    attempts: string[][][];
    colors: string[][][];
    currentRound: number[];
    currentLetter: number[];
    gameFinished: boolean[];
}

export interface GameStore extends Writable<GameState> {
    reset: () => void;
}