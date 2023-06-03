import assert from "node:assert";
import { batchExecute } from '../batch-execute.js';
import { getProvider } from "../providers/get-provider.js";

const providerArg = process.argv[2];
assert(providerArg, `provider missing as first argument`);
const provider = getProvider(providerArg);

await batchExecute(
    { limit: 1, },
    provider.batchExchange,
    async (exchanges) => {
        return Promise.allSettled(exchanges.map(async (exchange) => {
            const rate = await provider.getRate({
                exchangeOffice: exchange.exchange_office,
                date: exchange.date,
                from: exchange.from,
                to: exchange.to,
            });
            await provider.updateExchangeWithBid({
                id: exchange.id,
                bid: exchange.ask / (rate.out / rate.in),
            });
            console.log(`for ask: ${exchange.ask} found in: ${rate.in} out ${rate.out} bid: ${exchange.ask / (rate.out / rate.in)}`);
        }));
    });

await provider.destroy();
