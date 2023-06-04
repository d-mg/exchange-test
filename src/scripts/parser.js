import assert from "node:assert";
import { createInterface } from "node:readline";
import { createReadStream, createWriteStream } from "node:fs";
import {
    EXCHANGE_OFFICE,
    EXCHANGE,
    RATE,
    COUNTRY
} from "../constants.js";
import { getProvider } from "../providers/get-provider.js";
import { createEntity } from "../models/index.js";

const logFile = createWriteStream(`logs/debug.log`);
const providerArg = process.argv[2];
assert(providerArg, `provider missing as first argument`);
const fileArg = process.argv[3];
assert(fileArg, `file missing as second argument`);
const provider = getProvider(providerArg);
const readline = createInterface({
    input: createReadStream(fileArg),
});
const MAX_RETRIES = 3;
const MAX_PARALLEL = 5;

let current = null;
let running = [];
let count = 0;

await readLines();
current && await parallel(finishCurrent(current));
await Promise.allSettled(running);
await provider.destroy();
logFile.write(`Saved entities: ${count}\nCompleted successfully\n`);

async function readLines() {
    for await (const line of readline) {
        switch (line) {
        case `exchange-offices`:
        case `    exchanges`:
        case `    rates`:
        case `  countries`:
            break;
        case `  exchange-office`:
            current = await initCurrent({
                previous: current,
                entity: EXCHANGE_OFFICE,
            });
            break;
        case `      exchange`:
            current = await initCurrent({
                previous: current,
                parent: current.entity === EXCHANGE_OFFICE ?
                    current :
                    current.parent,
                entity: EXCHANGE,
            });
            break;
        case `      rate`:
            current = await initCurrent({
                previous: current,
                parent: current.entity === EXCHANGE_OFFICE ?
                    current :
                    current.parent,
                entity: RATE,
            });
            break;
        case `    country`:
            current = await initCurrent({
                previous: current,
                entity: COUNTRY,
            });
            break;
        default:
            current = addProp(current, line);
            break;
        }
    }
}

async function initCurrent({
    previous,
    parent,
    entity,
    data = {},
}) {
    assert(entity, `entity prop of argument missing`);
    previous && await parallel(finishCurrent(previous));

    return {
        entity,
        parent,
        data,
    };
}

function addProp(cur, line) {
    assert(cur, `current argument missing`);
    assert(line, `line argument missing`);
    const [prop, value,] = line.split(` = `);
    assert(value, `value in line argument missing`);

    return {
        ...cur,
        data: {
            ...cur.data,
            [prop.trimStart()]: value,
        },
    };
}

async function parallel(promise) {
    running.push(promise);

    if (MAX_PARALLEL <= running.length) {
        await Promise.allSettled(running);
        running = [];
    }
}

async function finishCurrent(cur, retry = 0) {
    try {
        await provider.save(
            cur.entity,
            createEntity(
                cur,
                ![EXCHANGE_OFFICE, COUNTRY,].includes(cur.entity)
            )
        );
        count++;
        logFile.write(`${JSON.stringify(cur, null, 2)}\n`);
    } catch (error) {
        retry++;
        if (retry >= MAX_RETRIES) {
            console.error(
                `An error happened while trying to finish an entity, max retries reached\n`,
                error,
                JSON.stringify({ current: cur, retry, }, null, 2)
            );
            logFile.write(`Saved entities: ${count}\nStopped due to error:\n${error}\n`);
            process.exit(0);
        }
        console.error(
            `An error happened while trying to finish an entity, will try again in ${(5000 * retry) / 1000} seconds\n`,
            error,
            JSON.stringify({ current: cur, retry, }, null, 2)
        );
        await new Promise(resolve => setTimeout(async () => {
            await finishCurrent(cur, retry);
            resolve();
        }, 5000 * retry));
    }
}
