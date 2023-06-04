import { createWriteStream } from "node:fs";

export function createLogger(fileName) {
    const name = fileName || `debug`;
    const file = createWriteStream(`logs/${name}.log`);
    let count = 0;

    return {
        log(msg) {
            file.write(`${msg}\n`);
        },
        onActionSuccess(msg) {
            count++;
            file.write(
                msg === `string` ?
                    msg :
                    `${JSON.stringify(msg, null, 2)}\n`
            );
        },
        onError(error) {
            file.write(`Count: ${count}\nStopped due to error:\n${error}\n`);
        },
        finish() {
            file.write(`Count: ${count}\nCompleted successfully\n`);
        },
    };
}
