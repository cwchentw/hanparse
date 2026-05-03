interface Rule {
    pattern: string;
    type: string;
    meaning: string;
    note?: string;
};

const lexicon: Rule[] = [
    {
        pattern: "이에요",
        type: "grammar",
        meaning: "am/are/is ...",
        note: "Used after nouns ending with a consonant."
    },
    {
        pattern: "예요",
        type: "grammar",
        meaning: "am/are/is ...",
        note: "Used after nouns ending with a vowel."
    },
    {
        pattern: "같이",
        type: "grammar",
        meaning: "like / as / together with",
        note: "Can indicate similarity or manner when attached to a noun (N+같이), but can also mean 'together with' depending on spacing and context."
    },
    {
        pattern: "에서",
        type: "grammar",
        meaning: "(Location particle)",
        note: "Indicates where an action takes place."
    },
    {
        "pattern": "이고",
        "type": "grammar",
        "meaning": "and (copula)",
        "note": "이다 + 고, used after nouns."
    },
    {
        pattern: "은",
        type: "grammar",
        meaning: "(Topic particle)",
        note: "Used after nouns ending with a consonant."
    },
    {
        pattern: "는",
        type: "grammar",
        meaning: "(Topic particle)",
        note: "Used after nouns ending with a vowel."
    },
    {
        pattern: "이",
        type: "grammar",
        meaning: "(Subject particle)",
        note: "Used after nouns ending with a consonant."
    },
    {
        pattern: "가",
        type: "grammar",
        meaning: "(Subject particle)",
        note: "Used after nouns ending with a vowel."
    },
    {
        pattern: "을",
        type: "grammar",
        meaning: "(Object particle)",
        note: "Used after nouns ending with a consonant."
    },
    {
        pattern: "를",
        type: "grammar",
        meaning: "(Object particle)",
        note: "Used after nouns ending with a vowel."
    },
    {
        pattern: "에",
        type: "grammar",
        meaning: "(Location / time particle)",
        note: "Indicates destination or time (to / at / on)."
    },
    {
        pattern: "도",
        type: "grammar",
        meaning: "(Also / too)",
        note: "Adds the meaning 'also' or 'too'."
    },
    {
        pattern: "의",
        type: "grammar",
        meaning: "(Possessive particle)",
        note: "Shows possession, similar to 'of' or '’s'."
    },
    {
        pattern: "만",
        type: "grammar",
        meaning: "(Only)",
        note: "Limits the meaning to 'only'."
    },
    {
        "pattern": "고",
        "type": "grammar",
        "meaning": "and",
        "note": "Used after verbs or adjectives to connect clauses."
    }
];

type LexiconBucket = Record<string, Rule[]>;

const bucket: LexiconBucket = lexicon.reduce((acc, rule) => {
    const lastChar = rule.pattern.slice(-1);
    if (!acc[lastChar]) acc[lastChar] = [];
    acc[lastChar].push(rule);
    return acc;
}, {} as LexiconBucket);

for (const key in bucket) {
    if (bucket[key])
        bucket[key].sort((a, b) => b.pattern.length - a.pattern.length);
}

const parse = (sentence: string) => {
    const results = [];
    let i = sentence.length;
    let isBound = false;

    while (i > 0) {
        const lastChar = sentence[i - 1];        

        if (typeof lastChar === 'undefined')
            break;

        /* Parse punctuation marks */
        if (/[.?!;]/.test(lastChar)) {
            results.push({ pattern: lastChar, type: "punctuation" });
            i--;
            isBound = true;
            continue;
        }

        /* Parse space */
        if (lastChar === " ") {
            const endSpace = i;
            while (i > 0 && sentence[i - 1] === " ") {
                i--;
            }
            results.push({
                pattern: sentence.substring(i, endSpace),
                type: "space"
            });
            isBound = true;
            continue;
        }

        /* Parse phrases and grammar words using Bucket */
        let matched = false;
        if (isBound && bucket[lastChar]) {
            for (const rule of bucket[lastChar]) {
                const start = i - rule.pattern.length;
                if (start >= 0 && sentence.substring(start, i) === rule.pattern) {
                    results.push(rule);
                    i = start;
                    isBound = false;
                    matched = true;
                    break;
                }
            }
        }

        if (matched) continue;

        /* Parse general text */
        const endText = i;
        while (i > 0 && sentence[i - 1] !== " ") {
            i--;
        }
        
        const textPattern = sentence.substring(i, endText);
        if (textPattern) {
            results.push({
                pattern: textPattern,
                type: "text"
            });
        }
        isBound = true;
    }

    return results.reverse();
};

const addRule = (rule: Rule) => {
    if (!rule || typeof rule.pattern !== "string") {
        throw new Error("Invalid rule: pattern must be a string");
    }

    if (rule.pattern.length === 0) {
        throw new Error("Invalid rule: empty pattern");
    }

    lexicon.push({ ...rule });

    lexicon.sort((a, b) =>
        (b.pattern || "").length - (a.pattern || "").length
    );
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
export { parse, addRule, getLexicon, dev };