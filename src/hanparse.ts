import { postgres } from 'bun';
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

if (isNode) {
    const module = await import('./rules.json', { with: { type: 'json' } });
    ruleData = module.default as Rule[];
}
else {
    const jsonUrl = new URL('./rules.json', import.meta.url).href;
    const response = await fetch(jsonUrl);
    ruleData = await response.json() as Rule[];
}

const rules: Rule[] = ruleData;

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

const lemmatize = (stem: string, peek: Rule) => {
    const pattern = peek.pattern;
    const pos = peek.after;
    const fusionJamo = peek.fusionJamo;

    if (pos.startsWith('verb') || pos.startsWith('adjective')) {
        let base;

        if (fusionJamo) {
            const fusedJamo = stem.at(stem.length - 1);
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
            const origJamo = hangul.assemble(origJamos);
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

const parse = (sentence: string) => {
    const results = [];
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

        /* Grammar Matching with Batchim Validation */
        let matched = false;
        if (isBound && currentBucket[lastChar]) {
            for (const rule of currentBucket[lastChar]) {
                const start = i - rule.pattern.length;
                if (start >= 0 && sentence.substring(start, i) === rule.pattern) {
                    let ruleMatch = true;
                    const prevChar = sentence[start - 1];

                    /* Bright / Dark Vowels Validation. */
                    if (prevChar && prevChar !== " " && rule.pattern.includes('습니다')) {
                        const jamos = hangul.disassemble(prevChar);
                        const index = jamos.indexOf('ㅆ');
                        if (index > -1) {
                            jamos.splice(index, 1);
                        }

                        if (typeof rule.fusionJamo === 'string') {
                            ruleMatch = ((rule.fusionJamo.includes('ㅏ') || rule.fusionJamo.includes('ㅓ'))
                                        && jamos.some(item => (rule.fusionJamo as string).includes(item)));
                        }
                    }

                    /* Batchim Validation */
                    if (typeof rule.requiresBatchim !== 'undefined') {
                        if (prevChar && prevChar !== " ") {
                            const hasB = hasBatchim(prevChar);

                            ruleMatch = ((hasB === rule.requiresBatchim)
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

    return results.reverse();
};

const addRule = (rule: Rule) => {
    rules.push({ ...rule });
    currentBucket = buildBucket(rules);
};

const getLexicon = () =>
    rules.map((entry) => ({ ...entry }));

const dev = Object.freeze({
    format (sentence : string) {
        return JSON.stringify(parse(sentence), null, 2);
    }
});

const hanparse = Object.freeze({
    parse,
    addRule,
    getLexicon,
    dev
});

/* ES Module CLI mode. */
if (import.meta.main) {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error('Usage: hanparse [Korean_Sentence]');
    }

    const sentence = args[0];
    if (typeof sentence === "string") {
        console.log(dev.format(sentence));
    }

    process.exit(0);
}

export default hanparse;
export { parse, addRule, getLexicon, hasBatchim, dev };