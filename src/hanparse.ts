import * as hangul from 'hangul-js';

interface Rule {
    pattern: string;
    type: string;
    meaning: string;
    after: string;
    note?: string;
    requiresBatchim?: boolean; // true: needs batchim, false: no batchim, undefined: both
    fusionJamo?: string;
}

interface Lexicon {
    word: string;
    pos: string;
    loadword?: string;
    trans: string;
}

interface LexerInstance {
    lex: (sentence: string) => LexerInstance;
    addRule: (rule: Rule) => void;
    getLexicon: () => Rule[];
    dev: {
        format: () => string;
    };
}

const PROGRAM = 'hanparse';
const VERSION = '0.1.0';

/**
 * Checks if a Korean character has a final consonant (Batchim).
 */
const hasBatchim = (char: string): boolean => {
    if (!char) return false;
    const code = char.charCodeAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return false;
    return (code - 0xAC00) % 28 !== 0;
};

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

let ruleData;
let properNounData;

if (isNode) {
    // @ts-expect-error
    const module = await import('./rules.json', { with: { type: 'json' } });
    ruleData = module.default as Rule[];

    // @ts-expect-error
    const moduleProperNoun = await import('./proper-noun.json', { with: { type: 'json'}});
    properNounData = moduleProperNoun.default as Lexicon[];
}
else {
    const jsonUrl = new URL('./rules.json', import.meta.url).href;
    const response = await fetch(jsonUrl);
    ruleData = await response.json() as Rule[];

    const jsonUrlProperNoun = new URL('./proper-noun.json', import.meta.url).href;
    const responseProperNoun = await fetch(jsonUrlProperNoun);
    properNounData = await responseProperNoun.json() as Lexicon[];
}

const rules: Rule[] = ruleData;
const properNouns: Lexicon[] = properNounData;

type LexiconBucket = Record<string, Rule[]>;

const buildBucket = (rules: Rule[]): LexiconBucket => {
    const bucket: LexiconBucket = {};
    rules.forEach(rule => {
        const lastChar = rule.pattern.slice(-1);
        if (!bucket[lastChar]) bucket[lastChar] = [];
        bucket[lastChar].push(rule);
    });
    for (const key in bucket) {
        bucket[key] && bucket[key].sort((a, b) => b.pattern.length - a.pattern.length);
    }
    return bucket;
};

let currentBucket = buildBucket(rules);

const vowels:  string[] = [
    'ㅏ', 'ㅓ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ', 'ㅐ', 'ㅔ', 'ㅚ', 'ㅟ', 'ㅢ',
    'ㅑ', 'ㅕ', 'ㅛ', 'ㅠ', 'ㅒ', 'ㅖ',
    'ㅘ', 'ㅝ', 'ㅙ', 'ㅞ'
];

const Lexer = (): LexerInstance => {
    let results: object[] = [];

    const lemmatize = (stem: string, peek: Rule) => {
        const pattern = peek.pattern;
        const pos = peek.after;
        const fusionJamo = peek.fusionJamo;

        if (pos.startsWith('verb') || pos.startsWith('adjective')) {
            let base;

            if (fusionJamo) {
                const fusedJamo = stem.at(stem.length - 1);
                let origJamo: string;
                if (fusedJamo === '았' || fusedJamo === '었') {
                    origJamo = stem.slice(0, -1);
                }
                else {
                    const jamos = hangul.disassemble(fusedJamo as string) as string[];
                    const fusionJamos = hangul.disassemble(fusionJamo);
                    let origJamos = jamos.filter(item => !fusionJamos.includes(item));
                    const hasVowels = origJamos.some(item => vowels.includes(item));
                    if (!hasVowels) {
                        if (fusionJamo.startsWith('ㅏ')) {
                            origJamos.push('ㅏ');
                        }
                        else if (fusionJamo.startsWith('ㅓ')) {
                            origJamos.push('ㅓ');
                        }
                    }
                    origJamo = hangul.assemble(origJamos);
                }

                base = origJamo + '다';
            }
            else {
                if (pattern.startsWith('했')) {
                    base = stem + '하다';
                }
                else {
                    base = stem + '다';
                }
            }

            return { pattern: stem, base: base, type: "text", pos: pos };
        }

        return { pattern: stem, type: "text", pos: pos };
    }

    const lex = (sentence: string) => {
        results = [];

        let i = sentence.length;
        let isBound = false;

        while (i > 0) {
            const lastChar = sentence[i - 1];
            if (typeof lastChar === 'undefined') break;

            /* Punctuation */
            if (/[.?!;]/.test(lastChar)) {
                results.push({ pattern: lastChar, type: "punctuation" });
                i--;
                isBound = true;
                continue;
            }

            /* Spaces */
            if (lastChar === " ") {
                const endSpace = i;
                while (i > 0 && sentence[i - 1] === " ") i--;
                results.push({ pattern: sentence.substring(i, endSpace), type: "space" });
                isBound = true;
                continue;
            }

            /* Proper Noun */
            if (isBound) {
                for (const properNoun of properNounData) {
                    if (properNoun.word.endsWith(lastChar)) {
                        let j = i;
                        while (j > 0 && sentence[j - 1] !== " " && !/[.?!;]/.test(sentence[i-1] as string)) {
                            j--;
                        }

                        if (properNoun.word == sentence.substring(j, i)) {
                            results.push({ pattern: sentence.substring(j, i), type: "noun"});
                            i = j;
                            continue;
                        }
                    }
                }
            }

            /* Grammar Matching with Batchim Validation */
            let matched = false;
            if (isBound && currentBucket[lastChar]) {
                for (const rule of currentBucket[lastChar]) {
                    const start = i - rule.pattern.length;
                    if (start >= 0 && sentence.substring(start, i) === rule.pattern) {
                        let ruleMatch = true;
                        const prevChar = sentence[start - 1];

                        /* Bright / Dark Vowels Validation. */
                        if (prevChar && prevChar !== " " && rule.pattern === '습니다') {
                            const jamos = hangul.disassemble(prevChar);
                            const index = jamos.indexOf('ㅆ');
                            if (index > -1) {
                                jamos.splice(index, 1);
                            }

                            if (typeof rule.fusionJamo === 'string') {
                                ruleMatch = ((rule.fusionJamo.includes('ㅏ') || rule.fusionJamo.includes('ㅓ'))
                                            && jamos.some(item => (rule.fusionJamo as string).includes(item)));
                            }
                            else if (index < 0 && typeof rule.requiresBatchim !== 'undefined') {
                                const hasB = hasBatchim(prevChar);

                                ruleMatch = (hasB === rule.requiresBatchim || hasB !== rule.requiresBatchim);
                            }
                            else {
                                ruleMatch = false;
                            }
                        }
                        /* Batchim Validation */
                        else if (typeof rule.requiresBatchim !== 'undefined') {
                            if (prevChar && prevChar !== " ") {
                                const hasB = hasBatchim(prevChar);

                                ruleMatch = (hasB === rule.requiresBatchim
                                            || (hasB !== rule.requiresBatchim && typeof rule.fusionJamo === 'string'));
                            } else {
                                ruleMatch = false;
                            }
                        }

                        if (ruleMatch) {
                            results.push(rule);
                            i = start;
                            isBound = false;
                            matched = true;
                            break;
                        }
                    }
                }
            }

            if (matched) continue;

            /* Text Fallback */
            const endText = i;
            while (i > 0 && sentence[i - 1] !== " " && !/[.?!;]/.test(sentence[i-1] as string)) {
                i--;
            }
        
            const textPattern = sentence.substring(i, endText);
            const peek: any = results.at(results.length -1);
            if (textPattern && peek && typeof peek.after === 'string') {
                results.push(lemmatize(textPattern, peek))
            }
            else if (textPattern) {
                results.push({ pattern: textPattern, type: "text" });
            }

            isBound = true;
        }

        results.reverse();

        return instance;
    };

    const addRule = (rule: Rule) => {
        rules.push({ ...rule });
        currentBucket = buildBucket(rules);
    };

    const getLexicon = () =>
        rules.map((entry) => ({ ...entry }));

    const dev = Object.freeze({
        format () {
            return JSON.stringify(results, null, 2);
        }
    });

    const instance = Object.freeze({
        lex,
        addRule,
        getLexicon,
        dev
    });

    return instance;
};

const hanparse = Object.freeze({
    Lexer
});

function printVersion() {
    console.log(VERSION);
}

function printHelp(stream = 'stdout') {
    const out = stream === 'stderr' ? console.error : console.log;

    out(`Usage ${PROGRAM} [Korean_Sentence]`);
    out("");
    out("Option:");
    out("    -v    --version    Show version info");
    out("    -h    --help       Show help info");
}

/* ES Module CLI mode. */
if (import.meta.main) {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        printHelp('stderr');
        process.exit(1);
    }

    let tokens: string[] = [];;
    for (const arg of args) {
        if (arg === '-v' || arg === '--version') {
            printVersion();
            process.exit(0);
        }
        else if (arg === '-h' || arg === '--help') {
            printHelp();
            process.exit(0);
        }

        tokens.push(arg);
    }

    let sentence;
    if (tokens.length === 1) {
        sentence = tokens[0];
    }
    else {
        sentence = tokens.join(' ');
    }

    if (typeof sentence === "string") {
        console.log(Lexer().lex(sentence).dev.format());
    }

    process.exit(0);
}

export default hanparse;