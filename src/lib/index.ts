import { words } from '../words';
const wordUsed: number[] = [];

export class Word {
    word: string
    correctWord?: string

    constructor(word: string, correctWord?: string) {
        this.word = word
        this.correctWord = correctWord
    }

    varifyword() {
        if (!this.correctWord) return false;

        return this.word === this.correctWord;
    }
}

export function chooseRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    if (wordUsed.includes(randomIndex)) return chooseRandomWord()
    wordUsed.push(randomIndex)
    return words[randomIndex];
}