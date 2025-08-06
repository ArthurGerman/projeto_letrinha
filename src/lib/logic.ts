import type { GameStore } from './type';

export function checkGuess(store: GameStore) {
    let restart = false;

    store.update((state) => {
        const round = state.currentRound;
        let lineCheck: boolean = false

        for (let p = 0; p < state.secretWord.length; p++) {
            if (state.gameFinished[p]) continue;

            const line = state.attempts[p][round];
            if (line.some(l => !l || l.length !== 1)) continue;
            const Guess = line.join('').toUpperCase();

            lineCheck = true

            const secretWord = state.secretWord[p].word.toUpperCase();
            const secretLetters = secretWord.split('');
            const roundColor = Array(5).fill('gray');
            const usedLetters = Array(5).fill(false);

            for (let i = 0; i < 5; i++) {
                if (Guess[i] === secretLetters[i]) {
                    roundColor[i] = 'green';
                    usedLetters[i] = true;
                }
            }

            for (let i = 0; i < 5; i++) {
                if (roundColor[i] === 'gray') {
                    for (let j = 0; j < 5; j++) {
                        if (!usedLetters[j] && Guess[i] === secretLetters[j]) {
                            roundColor[i] = 'yellow';
                            usedLetters[j] = true;
                            break;
                        }
                    }
                }
            }

            state.colors[p][round] = roundColor;

            if (Guess === secretWord) {
                state.gameFinished[p] = true;
                state.secretWord[p].correctWord = Guess
            }
        }

        if (lineCheck) {
            if (!state.gameFinished.every(f => f) && round < 5) {
                state.currentRound = round + 1;
                state.currentLetter = state.currentLetter.map(() => 0);
            } else {
                state.gameFinished = state.gameFinished.map(() => true);
                restart = true;
            }
        }


        return state;
    });

    if (restart) {
        setTimeout(() => store.reset(), 3000);
    }
}


export function virtualKeyboard(store: GameStore, key: string) {
    store.update((state) => {
        const round = state.currentRound;
        if (round >= 6) return state;

        if (key === 'ENTER') {
            checkGuess(store);
            return state;
        }

        if (key === '←') {
            for (let p = 0; p < state.secretWord.length; p++) {
                if (state.gameFinished[p]) continue;
                const line = [...state.attempts[p][round]];
                const idx = line.findLastIndex(l => l !== '');
                if (idx >= 0) {
                    line[idx] = '';
                    state.attempts[p][round] = line;
                    state.currentLetter[p] = idx;
                }
            }
            return state;
        }

        if (/^[A-Z]$/.test(key)) {
            for (let p = 0; p < state.secretWord.length; p++) {
                if (state.gameFinished[p]) continue;
                const line = [...state.attempts[p][round]];
                const pos = line.findIndex(l => l === '');
                if (pos !== -1) {
                    line[pos] = key;
                    state.attempts[p][round] = line;
                    state.currentLetter[p] = pos + 1;
                }
            }
        }

        return state;
    });
}

export function createKeyHandler(store: GameStore) {
    return (e: KeyboardEvent) => {
        const key = e.key.toUpperCase();

        if (key === 'BACKSPACE') {
            e.preventDefault();
            virtualKeyboard(store, '←');
        } else if (key === 'ENTER') {
            e.preventDefault();
            virtualKeyboard(store, 'ENTER');
        } else if (/^[A-Z]$/.test(key)) {
            virtualKeyboard(store, key);
        }
    };
}
