import Lexer from './Lexer';


const PROGRAM = 'hanparse';
const VERSION = '0.1.0';

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