import assert from "node:assert";
import { createInterface } from "node:readline";
import { createReadStream } from "node:fs";
import { createParallel } from "../parallel.js";
import { createRetryable } from "../retry.js";
import { createLogger } from "../log-script-to-file.js";
import { createEntity } from "../models/index.js";
import { getProvider } from "../providers/get-provider.js";
import {
    MAX_RETRIES,
    MAX_PARALLEL,
    EXCHANGE_OFFICE,
    EXCHANGE,
    RATE,
    COUNTRY
} from "../constants.js";

const log = createLogger(`parser-${Date.now()}`);
const parallel = createParallel(MAX_PARALLEL);

const providerArg = process.argv[2];
assert(providerArg, `provider missing as first argument`);
const fileArg = process.argv[3];
assert(fileArg, `file missing as second argument`);
const provider = getProvider(providerArg);
const file = createInterface({
    input: createReadStream(fileArg),
});

const SAVE_ERR_MSG = `An error happened while trying to finish an entity`;

const finish = createRetryable({
    time: 5000,
    max: MAX_RETRIES,
    fn: (cur) =>
        provider.save(
            cur.entity,
            createEntity(
                cur,
                ![EXCHANGE_OFFICE, COUNTRY,].includes(cur.entity)
            )
        ),
    onActionSuccess: ({ arg, }) => log.onAction(arg),
    onActionError: ({ error, arg, retryIn, }) =>
        log.onError(`${SAVE_ERR_MSG}, will try again in ${retryIn} seconds`, error, { arg, }),
    onError : async ({ error, arg, }) =>
        log.onError(`${SAVE_ERR_MSG}, max retries reached`, error, { arg, }),
});

let current = null;
await read();
current && await parallel.execute(finish(current));
await parallel.finish();
await provider.destroy();
log.finish();

async function read() {
    for await (const line of file) {
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
    previous && await parallel.execute(finish(previous));

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
