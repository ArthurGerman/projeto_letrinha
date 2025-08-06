import { writable } from 'svelte/store';

export const audioRef = writable<HTMLAudioElement | null>(null);
export const musicOn = writable(false);