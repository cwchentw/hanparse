interface Rule {
    pattern: string;
    type: string;
    meaning: string;
    note?: string;
    requiresBatchim?: boolean; // true: needs batchim, false: no batchim, undefined: both
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

const lexicon: Rule[] = [
    // --- Sentence Endings (Copula) ---
    { 
        pattern: "이에요", 
        type: "grammar", 
        meaning: "am/are/is (polite)", 
        requiresBatchim: true, 
        note: "Polite ending used after nouns ending with a consonant (Batchim)." 
    },
    { 
        pattern: "예요", 
        type: "grammar", 
        meaning: "am/are/is (polite)", 
        requiresBatchim: false, 
        note: "Polite ending used after nouns ending with a vowel (No Batchim)." 
    },

    // --- Particles (Josa) ---
    { 
        pattern: "은", 
        type: "grammar", 
        meaning: "(Topic particle)", 
        requiresBatchim: true, 
        note: "Used after nouns ending with a consonant to indicate the topic or contrast." 
    },
    { 
        pattern: "는", 
        type: "grammar", 
        meaning: "(Topic particle)", 
        requiresBatchim: false, 
        note: "Used after nouns ending with a vowel to indicate the topic or contrast." 
    },
    { 
        pattern: "이", 
        type: "grammar", 
        meaning: "(Subject particle)", 
        requiresBatchim: true, 
        note: "Used after nouns ending with a consonant to mark the subject of a sentence." 
    },
    { 
        pattern: "가", 
        type: "grammar", 
        meaning: "(Subject particle)", 
        requiresBatchim: false, 
        note: "Used after nouns ending with a vowel to mark the subject of a sentence." 
    },
    { 
        pattern: "을", 
        type: "grammar", 
        meaning: "(Object particle)", 
        requiresBatchim: true, 
        note: "Used after nouns ending with a consonant to mark the direct object." 
    },
    { 
        pattern: "를", 
        type: "grammar", 
        meaning: "(Object particle)", 
        requiresBatchim: false, 
        note: "Used after nouns ending with a vowel to mark the direct object." 
    },
    { 
        pattern: "에서", 
        type: "grammar", 
        meaning: "at / from", 
        note: "Indicates the location where an action takes place or a starting point." 
    },
    { 
        pattern: "에", 
        type: "grammar", 
        meaning: "to / at / on", 
        note: "Indicates destination, location of existence, or a specific time." 
    },
    { 
        pattern: "도", 
        type: "grammar", 
        meaning: "also / too", 
        note: "Additive particle used to mean 'also' or 'too', often replacing subject/object particles." 
    },
    { 
        pattern: "의", 
        type: "grammar", 
        meaning: "(Possessive)", 
        note: "Shows possession, equivalent to 's or 'of' in English." 
    },
    { 
        pattern: "만", 
        type: "grammar", 
        meaning: "only", 
        note: "Limiting particle used to express 'only' or 'just'." 
    },
    { 
        pattern: "같이", 
        type: "grammar", 
        meaning: "like / together", 
        note: "Can mean 'like/as' when attached to a noun, or 'together' as an adverb." 
    },

    // --- Connectives ---
    { 
        pattern: "이고", 
        type: "grammar", 
        meaning: "is and...", 
        note: "Connective form of the copula (이다) used to link nouns." 
    },
    { 
        pattern: "고", 
        type: "grammar", 
        meaning: "and / then", 
        note: "Connective ending for verbs and adjectives to link clauses." 
    },
    { 
        pattern: "다가", 
        type: "connective_ending", 
        meaning: "while / transition", 
        note: "Indicates a transition from one action/state to another during the process." 
    },
    { 
        pattern: "에다가", 
        type: "particle", 
        meaning: "onto / in addition to", 
        note: "Added to nouns to emphasize a location of an action or an addition to a target." 
    },
    { 
        pattern: "에게다가", 
        type: "particle", 
        meaning: "to (someone)", 
        note: "Emphasizes the recipient of an action for animate beings." 
    },
    { 
        pattern: "한테다가", 
        type: "particle", 
        meaning: "to (someone, colloquial)", 
        note: "The colloquial version of 에게다가." 
    },
    { 
        pattern: "는 데다가", 
        type: "grammar_structure", 
        meaning: "not only... but also", 
        requiresBatchim: false, 
        note: "Used after verb stems without a batchim to express cumulative addition." 
    },
    { 
        pattern: "은 데다가", 
        type: "grammar_structure", 
        meaning: "not only... but also", 
        requiresBatchim: true, 
        note: "Used after verb stems with a batchim or in past tense." 
    },
    { 
        pattern: "인 데다가", 
        type: "grammar_structure", 
        meaning: "not only... but also", 
        note: "Used after nouns (Noun + 이다) to indicate addition." 
    },
    { 
        pattern: "데다가", 
        type: "grammar_structure", 
        meaning: "in addition to", 
        note: "General structure used to describe adding something to a situation." 
    }
];

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

let currentBucket = buildBucket(lexicon);

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
                    
                    /* Batchim Validation */
                    let batchimMatch = true;
                    if (typeof rule.requiresBatchim !== 'undefined') {
                        const prevChar = sentence[start - 1];
                        if (prevChar && prevChar !== " ") {
                            const hasB = hasBatchim(prevChar);
                            batchimMatch = (hasB === rule.requiresBatchim);
                        } else {
                            batchimMatch = false; 
                        }
                    }

                    if (batchimMatch) {
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
        if (textPattern) {
            results.push({ pattern: textPattern, type: "text" });
        }
        isBound = true;
    }

    return results.reverse();
};

const addRule = (rule: Rule) => {
    lexicon.push({ ...rule });
    currentBucket = buildBucket(lexicon);
};

const getLexicon = () =>
    lexicon.map((entry) => ({ ...entry }));

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

    const sentence = args[0];
    if (typeof sentence === "string") {
        console.log(dev.format(sentence));
    }

    process.exit(0);
}

export default hanparse;
export { parse, addRule, getLexicon, hasBatchim, dev };