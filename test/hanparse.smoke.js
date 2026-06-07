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
        input: "저는 대만 사람이에요.",
        mustInclude: ["저", "는", "대만", "사람", "이에요", "."]
    },
    {
        input: "저는 대만 사람입니다.",
        mustInclude: ["저", "는", "대만", "사람", "입니다", "."]
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
        input: "책과 펜",
        mustInclude: ["책", "과", "펜"]
    },
    {
        input: "사과와 배",
        mustInclude: ["사과", "와", "배"]
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
    },
    {
        input: "저는 밥을 먹습니다.",
        mustInclude: ["저", "는", "밥", "을", "먹", "습니다", "."]
    },
    {
        input: "저는 학교에 갑니다.",
        mustInclude: ["저", "는", "학교", "에", "갑", "니다", "."]
    },
    {
        input: "저는 학교에 갔습니다.",
        mustInclude: ["저", "는", "학교", "에", "갔", "습니다", "."],
        mustIncludeBase: ["가다", "았습니다"]
    },
    {
        input: "한국에서 살았습니다.",
        mustInclude: ["한국", "에서", "살", "았습니다", "."],
        mustIncludeBase: ["살다"]
    },
    {
        input: "저는 책을 읽었습니다.",
        mustInclude: ["저", "는", "책", "을", "읽", "었습니다", "."]
    },
    {
        input: "학생들이 교실에서 섰습니다.",
        mustInclude: ["학생", "교실", "에서", "섰", "습니다", "."],
        mustIncludeBase: ["서다", "었습니다"]
    },
    {
        input: "저는 밥을 먹었습니다.",
        mustInclude: ["저", "는", "밥", "을", "먹", "었습니다", "."],
        mustIncludeBase: ["먹다"]
    },
    {
        input: "회의를 준비했습니다.",
        mustInclude: ["회의", "를", "준비", "했습니다", "."],
        mustIncludeBase: ["준비하다"]
    },
    {
        input: "학생이고 친구이고 동료예요.",
        mustInclude: ["학생", "이고", "친구", "이고", "동료", "예요", "."]
    },
    {
        input: "저는 학생이고 매일 공부하고 자요.",
        mustInclude: ["저", "는", "학생", "이고", "공부하", "고", "."]
    },
    {
        input: "학교에 가다가 친구를 만났어요.",
        mustInclude: ["학교", "에", "다가", "친구", "를", "."]
    },
    {
        input: "책상에다가 놓으세요.",
        mustInclude: ["책상", "에다가", "."]
    },
    {
        input: "동생에게다가 물어봤어요.",
        mustInclude: ["동생", "에게다가", "."]
    },
    {
        input: "나한테다가 던졌어요.",
        mustInclude: ["나", "한테다가", "."]
    },
    {
        input: "비가 오는 데다가 바람도 불어요.",
        mustInclude: ["비", "가", "는 데다가", "바람", "도", "."]
    }
];

for (const { input, mustInclude, mustIncludeBase } of cases) {
    const output = hanparse.Lexer().lex(input).dev.format();

    console.log(input);
    console.log(output);

    for (const text of mustInclude) {
        if (!output.includes(text)) {
            console.error(`Missing expected text: ${text}`);
            process.exit(1);
        }
    }

    if (mustIncludeBase) {
        for (const text of mustIncludeBase) {
            if (!output.includes(text)) {
                console.error(`Missing expected base text: ${text}`);
                process.exit(1);
            }
        }
    }

    console.log("OK\n");
}