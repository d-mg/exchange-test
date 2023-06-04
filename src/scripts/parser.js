import assert from "node:assert";
import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";
import {
    MAX_PARALLEL,
    EXCHANGE_OFFICE,
    EXCHANGE,
    RATE,
    COUNTRY
} from "../constants.js";
import { getProvider } from "../providers/get-provider.js";
import { createEntity } from "../models/index.js";
import { createParallel } from "../parallel.js";
import { createLogger } from "../log-script-to-file.js";

const MAX_RETRIES = 3;

const log = createLogger(`parser-${Date.now()}`);
const parallel = createParallel(MAX_PARALLEL);

let current = null;

const providerArg = process.argv[2];
assert(providerArg, `provider missing as first argument`);
const fileArg = process.argv[3];
assert(fileArg, `file missing as second argument`);
const provider = getProvider(providerArg);
const readline = createInterface({
    input: createReadStream(fileArg),
});

await readLines();
current && await parallel.execute(finishCurrent(current));
await parallel.finish();
await provider.destroy();
log.finish();

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
    previous && await parallel.execute(finishCurrent(previous));

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

async function finishCurrent(cur, retry = 0) {
    try {
        await provider.save(
            cur.entity,
            createEntity(
                cur,
                ![EXCHANGE_OFFICE, COUNTRY,].includes(cur.entity)
            )
        );
        log.onActionSuccess(cur);
    } catch (error) {
        retry++;
        if (retry >= MAX_RETRIES) {
            console.error(
                `An error happened while trying to finish an entity, max retries reached\n`,
                error,
                JSON.stringify({ current: cur, retry, }, null, 2)
            );
            log.onError(error);
            await provider.destroy();
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
