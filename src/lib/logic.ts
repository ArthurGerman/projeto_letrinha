import type { GameStore } from './type';

export function verificarPalpite(store: GameStore) {
    let restart = false;

    store.update((state) => {
        const rodada = state.currentRound[0];
        let lineCheck : boolean = false

        for (let p = 0; p < state.secretWord.length; p++) {
            if (state.gameFinished[p]) continue;

            //const palpite = state.attempts[p][rodada].join('').toUpperCase();
            //if (palpite.length !== 5) continue;

            const linha = state.attempts[p][rodada];
            if (linha.some(l => !l || l.length !== 1)) continue;
            const palpite = linha.join('').toUpperCase();

            lineCheck = true

            const palavraSecreta = state.secretWord[p].word.toUpperCase();
            const letrasSecretas = palavraSecreta.split('');
            const coresDaRodada = Array(5).fill('cinza');
            const letrasUsadas = Array(5).fill(false);

            for (let i = 0; i < 5; i++) {
                if (palpite[i] === letrasSecretas[i]) {
                    coresDaRodada[i] = 'verde';
                    letrasUsadas[i] = true;
                }
            }

            for (let i = 0; i < 5; i++) {
                if (coresDaRodada[i] === 'cinza') {
                    for (let j = 0; j < 5; j++) {
                        if (!letrasUsadas[j] && palpite[i] === letrasSecretas[j]) {
                            coresDaRodada[i] = 'amarelo';
                            letrasUsadas[j] = true;
                            break;
                        }
                    }
                }
            }

            state.colors[p][rodada] = coresDaRodada;

            if (palpite === palavraSecreta) {
                state.gameFinished[p] = true;
            }
        }

        if (lineCheck){
            if (!state.gameFinished.every(f => f) && rodada < 5) {
                state.currentRound = state.currentRound.map(() => rodada + 1);
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


export function virtualKeyboard(store: GameStore, tecla: string) {
    store.update((state) => {
        const rodada = state.currentRound[0];
        if (rodada >= 6) return state;

        if (tecla === 'ENTER') {
            verificarPalpite(store);
            return state;
        }

        if (tecla === '←') {
            for (let p = 0; p < state.secretWord.length; p++) {
                if (state.gameFinished[p]) continue;
                const linha = [...state.attempts[p][rodada]];
                const idx = linha.findLastIndex(l => l !== '');
                if (idx >= 0) {
                    linha[idx] = '';
                    state.attempts[p][rodada] = linha;
                    state.currentLetter[p] = idx;
                }
            }
            return state;
        }

        if (/^[A-Z]$/.test(tecla)) {
            for (let p = 0; p < state.secretWord.length; p++) {
                if (state.gameFinished[p]) continue;
                const linha = [...state.attempts[p][rodada]];
                const pos = linha.findIndex(l => l === '');
                if (pos !== -1) {
                    linha[pos] = tecla;
                    state.attempts[p][rodada] = linha;
                    state.currentLetter[p] = pos + 1;
                }
            }
        }

        return state;
    });
}

export function createKeyHandler(store: GameStore) {
    return (e: KeyboardEvent) => {
        const tecla = e.key.toUpperCase();

        if (tecla === 'BACKSPACE') {
            e.preventDefault();
            virtualKeyboard(store, '←');
        } else if (tecla === 'ENTER') {
            e.preventDefault();
            virtualKeyboard(store, 'ENTER');
        } else if (/^[A-Z]$/.test(tecla)) {
            virtualKeyboard(store, tecla);
        }
    };
}
