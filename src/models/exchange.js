import { validator } from "./validator/index.js";
import { toCurrencyString } from "./transform/index.js";
import { EXCHANGE } from "../constants.js";

export function create({ data, parent, }, partial = false) {
    const entity = {
        id: data.id && Number(data.id),
        exchangeOffice: parent.data.id && Number(parent.data.id),
        from: data.from,
        to: data.to,
        bid: data.bid && toCurrencyString(data.bid),
        ask: data.ask && toCurrencyString(data.ask),
        date: data.date,
    };
    check(entity, partial);
    return entity;
}

export function check(entity, partial = false) {
    const {
        isInteger,
        isString,
        isCurrencyString,
        isDateString,
    } = validator({
        name: EXCHANGE,
        entity,
        partial,
    });
    isInteger(`id`);
    isInteger(`exchangeOffice`);
    isString(`from`, 3);
    isString(`to`, 3);
    isCurrencyString(`bid`);
    isCurrencyString(`ask`);
    isDateString(`date`);
}
