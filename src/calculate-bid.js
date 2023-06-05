import {
    check as checkExchange,
    create as createExchange
} from "./models/exchange.js";
import { check as checkRate } from "./models/rate.js";
import { validator } from "./models/validator/index.js";

export function calculateBid(exchange, rate) {
    checkExchange(exchange, true);
    checkRate(rate);
    validator().isCurrencyString(exchange.ask);

    const askInt = Math.round(Number(exchange.ask) * 100000);
    const outInt = Math.round(Number(rate.out) * 100000);
    const inInt = Math.round(Number(rate.in) * 100000);
    const bid = Math.round((askInt / (outInt / inInt)) / 1000) / 100;

    return createExchange({
        ...exchange,
        bid,
    });
}
