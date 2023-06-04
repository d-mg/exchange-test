import {
    EXCHANGE_OFFICE,
    EXCHANGE,
    RATE,
    COUNTRY
} from "../constants.js";
import { create as createExchangeOffice } from "./exchange-office.js";
import { create as createExchange } from "./exchange.js";
import { create as createRate } from "./rate.js";
import { create as createCountry } from "./country.js";

export function createEntity({ entity, data, parent, }, partial = false) {
    switch (entity) {
    case EXCHANGE_OFFICE:
        return createExchangeOffice({ data, }, partial);
    case EXCHANGE:
        return createExchange({ data, parent, }, partial);
    case RATE:
        return createRate({ data, parent, }, partial);
    case COUNTRY:
        return createCountry({ data, }, partial);
    default:
        throw new Error(`unknown entity`);
    }
}
