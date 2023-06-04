import assert from "node:assert";
import { createRetryable } from "../retry.js";
import { batchExecute } from "../batch-execute.js";
import { calculateBid } from "../calculate-bid.js";
import { createLogger } from "../log-script-to-file.js";
import { getProvider } from "../providers/get-provider.js";
import {
    MAX_RETRIES,
    MAX_PARALLEL
} from "../constants.js";

const log = createLogger(`calculate-bid-${Date.now()}`);

const providerArg = process.argv[2];
assert(providerArg, `provider missing as first argument`);
const provider = getProvider(providerArg);

const BATCH_ERR_MSG = `An error happened while trying to query a batch of exchanges`;
const UPDATE_ERR_MSG = `An error happened while trying to calculate and update an exchange's bid`;

const batchExchange = createRetryable({
    time: 5000,
    max: MAX_RETRIES,
    fn: provider.batchExchange,
    onActionError: ({ error, arg, retryIn, }) =>
        log.onError(`${BATCH_ERR_MSG}, will try again in ${retryIn} seconds`, error.stack, { arg, }),
    onError: async ({ error, arg, }) =>
        log.onError(`${BATCH_ERR_MSG}, max retries reached`, error.stack, { arg, }),
});

const updateWithRate = createRetryable({
    time: 5000,
    max: MAX_RETRIES,
    fn: async (exchange) => {
        const rate = await provider.getRateForExchange(exchange);
        if (!rate) {
            log.message(`couldn't find rate for exchange: ${JSON.stringify(arg.exchange, null, 2)}`);
            return;
        }

        const exchangeWithBid = calculateBid(exchange, rate);
        await provider.updateExchangeWithBid(exchangeWithBid);
        return exchangeWithBid;
    },
    onActionSuccess: ({ result, }) => log.onAction(result),
    onActionError: ({ error, arg, retryIn, }) =>
        log.onError(`${UPDATE_ERR_MSG}, will try again in ${retryIn} seconds`, error.stack, { exchange: arg.exchange, }),
    onError: ({ error, arg, }) =>
        log.onError(`${UPDATE_ERR_MSG}, max retries reached`, error.stack, { exchange: arg.exchange, }),
});

await batchExecute(
    { limit: MAX_PARALLEL, },
    batchExchange,
    async (exchanges) => Promise.allSettled(exchanges.map(updateWithRate))
);

await provider.destroy();
log.finish();
