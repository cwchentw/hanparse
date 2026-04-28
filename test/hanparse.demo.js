import { execSync } from "child_process";

const cases = [
    "저것은 자동차예요.",
    "이것은 무엇이에요?",
    "물이 차요.",
    "고양이가 귀여워요.",
    "물을 마셔요.",
    "커피를 마셔요.",
    "학교에 가요",
    "학교에서 공부해요",
    "저도 가요.",
    "물만 마셔요.",
    "친구의 이름이에요.",
    "아이같이 웃어요.",
    "학생이고 친구이고 동료예요.",
    "저는 학생이고 매일 공부하고 자요."
];

for (const sentence of cases) {
    try {
        const output = execSync(
            `bun ./dist/hanparse.js "${sentence}"`,
            { encoding: "utf-8" }
        );

        console.log(output);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Command failed:", error.message);
        } else {
            console.error("Command failed:", error);
        }
    }
}