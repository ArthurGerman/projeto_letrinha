import type { Word } from '$lib';
import type { Writable } from 'svelte/store';

export interface GameState {
    secretWords: Word[];
    attempts: string[][][];
    colors: string[][][];
    currentRound: number;
    currentLetters: number[];
    gameFinisheds: boolean[];
}

export type GameStore = Writable<GameState> & {
    reset: () => void;
};