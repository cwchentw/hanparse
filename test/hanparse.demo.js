import { execSync } from "child_process";

const cases = [
    "저것은 자동차예요.",
    "이것은 무엇이에요?"
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