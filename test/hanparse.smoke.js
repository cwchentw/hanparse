import hanparse from "../dist/hanparse.js";

const cases = [
    {
        input: "저것은 자동차예요.",
        mustInclude: ["저것", "은", "자동차", "예요", "."]
    },
    {
        input: "이것은 무엇이에요?",
        mustInclude: ["이것", "은", "무엇", "이에요", "?"]
    },
    {
        input: "물이 차요.",
        mustInclude: ["물", "이", "."]
    },
    {
        input: "고양이가 귀여워요.",
        mustInclude: ["고양이", "가", "."]
    },
    {
        input: "물을 마셔요.",
        mustInclude: ["물", "을", "."]
    },
    {
        input: "커피를 마셔요.",
        mustInclude: ["커피", "를", "."]
    },
    {
        input: "학교에 가요.",
        mustInclude: ["학교", "에", "."]
    },
    {
        input: "학교에서 공부해요.",
        mustInclude: ["학교", "에서", "."]
    },
    {
        input: "저도 가요.",
        mustInclude: ["저", "도", "."]
    },
    {
        input: "물만 마셔요.",
        mustInclude: ["물", "만", "."]
    },
    {
        input: "친구의 이름이에요.",
        mustInclude: ["친구", "의", "이름", "이에요", "."]
    },
    {
        input: "아이같이 웃어요.",
        mustInclude: ["아이", "같이", "."]
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