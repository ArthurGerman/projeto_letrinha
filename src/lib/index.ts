import { words } from '../words';
const wordUsed: number[] = [];

export class Word {
    word: string

    constructor(word: string) {
        this.word = word
    }

    varifyword(word: string) {
        if (word === this.word) return true;

        return false;
    }
}

export function chooseRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    if (wordUsed.includes(randomIndex)) return chooseRandomWord()
    wordUsed.push(randomIndex)
    return words[randomIndex];
}