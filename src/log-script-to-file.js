import { createWriteStream } from "node:fs";

export function createLogger(fileName) {
    const name = fileName || `debug`;
    const file = createWriteStream(`logs/${name}.log`);
    let count = 0;

    return {
        message(msg) {
            file.write(`${msg}\n`);
        },
        onAction(msg) {
            count++;
            file.write(
                msg === `string` ?
                    msg :
                    `${JSON.stringify(msg, null, 2)}\n`
            );
        },
        onError(msg, error, context) {
            file.write(`${msg}\n${error}\n${JSON.stringify(context, null, 2)}\n`);
        },
        finish() {
            file.write(`Finished script\nAction count: ${count}\n`);
        },
    };
}
