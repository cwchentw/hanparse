import hanparse from "../dist/hanparse.js";

const cases = [
    {
        input: "저것은 자동차예요.",
        mustInclude: ["저것", "은", "자동차", "예요", "."]
    },
    {
        input: "이것은 무엇이에요?",
        mustInclude: ["이것", "은", "무엇", "이에요", "?"]
    }
];

for (const { input, mustInclude } of cases) {
    const output = hanparse.dev.format(input);

    console.log(input);
    console.log(output);

    for (const text of mustInclude) {
        if (!output.includes(text)) {
            console.error(`Missing expected text: ${text}`);
            process.exit(1);
        }
    }

    console.log("OK\n");
}