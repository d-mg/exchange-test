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

    const askInt = Number(exchange.ask) * 100000;
    const outInt = Number(rate.out) * 100000;
    const inInt = Number(rate.in) * 100000;
    const bid = (askInt / (outInt / inInt)) / 100000;

    return createExchange({
        ...exchange,
        bid,
    });
}
