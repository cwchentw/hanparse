export interface Rule {
    pattern: string;
    type: string;
    meaning: string;
    after: string;
    note?: string;
    requiresBatchim?: boolean; // true: needs batchim, false: no batchim, undefined: both
    fusionJamo?: string;
}

export interface Lexicon {
    word: string;
    pos: string;
    loadword?: string;
    trans: string;
}

export interface LexerInstance {
    lex: (sentence: string) => LexerInstance;
    addRule: (rule: Rule) => void;
    getLexicon: () => Rule[];
    dev: {
        format: () => string;
    };
}
