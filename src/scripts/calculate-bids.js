import assert from "node:assert";
import { batchExecute } from '../batch-execute.js';
import { getProvider } from "../providers/get-provider.js";
import { calculateBid } from "../calculate-bid.js";
import { createLogger } from "../log-script-to-file.js";
import { MAX_PARALLEL } from "../constants.js";

const log = createLogger(`calculate-bid-${Date.now()}`);

const providerArg = process.argv[2];
assert(providerArg, `provider missing as first argument`);
const provider = getProvider(providerArg);

await batchExecute(
    { limit: MAX_PARALLEL, },
    provider.batchExchange,
    async (exchanges) => Promise.allSettled(exchanges.map(updateWithRate))
);

await provider.destroy();
log.finish();

async function updateWithRate(exchange) {
    try {
        const rate = await provider.getRateForExchange(exchange);
        if (!rate) {
            console.log(`couldn't find rate for exchange`, JSON.stringify(exchange, null, 2));
            return;
        }

        const exchangeWithBid = calculateBid(exchange, rate);
        await provider.updateExchangeWithBid(exchangeWithBid);
        log.onActionSuccess(exchangeWithBid);
    } catch (error) {
        log.onActionError(error);
    }
}
