export interface Rule {
    pattern: string;
    type: string;
    meaning: string;
    after: string;
    note?: string;
    requiresBatchim?: boolean; // true: needs batchim, false: no batchim, undefined: both
    fusionJamo?: string;
}

export interface Token extends Pick<Rule, 'pattern' | 'type'> {
    base?: string;
}

export interface Lexicon {
    word: string;
    pos: string;
    loadword?: string;
    trans: string;
}

interface TokenNextResultSuccess {
    value: Token;
    done: false;
}

interface TokenNextResultDone {
    value: null;
    done: true;
}

export type TokenNextResult = TokenNextResultSuccess | TokenNextResultDone;

export interface LexerInstance {
    lex: (sentence: string) => LexerInstance;
    next: () => TokenNextResult;
    addRule: (rule: Rule) => void;
    getLexicon: () => Rule[];
    dev: {
        format: () => string;
    };
}
