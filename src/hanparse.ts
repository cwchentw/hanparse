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
        meaning: "am/are/is ..."
    },
    {
        pattern: "예요",
        type: "grammar",
        meaning: "am/are/is ..."
    },
    {
        pattern: "은",
        type: "grammar",
        meaning: "(Subject particle)",
        note: "Function words, no translation needed."
    },
    {
        pattern: "는",
        type: "grammar",
        meaning: "(Subject particle)",
        note: "Function words, no translation needed."
    }
];

/* TODO: Compile the lexicon to a prefix bucket at runtime. */

const parse = (sentence : String) => {
    const results = [];
    let i = sentence.length;

    while (i > 0) {
        /* Parse punctuation marks. */
        const ch = sentence.substring(i - 1, i);
        if (/[.?!;]/.test(ch)) {
            results.unshift({ pattern: ch, type: "punctuation" });
            i--;
            continue;
        }

        /* Parse phrases and grammar words. */
        let found = false;
        for (const rule of lexicon) {
            const start = i - rule.pattern.length;

            if (start >= 0 && sentence.substring(start, i) === rule.pattern) {
                results.unshift(rule);
                i = start;
                found = true;
                break;
            }
        }

        if (found) continue;

        /* Parse space */
        const chSpace = sentence.substring(i - 1, i);
        if (chSpace === " ") {
            const endSpace = i;
            while (i > 0 && sentence.substring(i - 1, i) === " ") {
                i--;
            }
            results.unshift({
                pattern: sentence.substring(i, endSpace),
                type: "space"
            });
            continue;
        }

        /* Parse general text. */
        const endText = i;
        while (i > 0 && sentence.substring(i - 1, i) !== " ") {
            i--;
        }
        results.unshift({
            pattern: sentence.substring(i, endText),
            type: "text"
        });
    }

    return results;
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
    format (sentence : String) {
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