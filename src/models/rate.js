import { validator } from "./validator/index.js";
import { EXCHANGE } from "../constants.js";
import { toDateString } from "./transform/index.js";

export function create(data, partial = false, parent) {
    const entity = {
        id: data.id && Number(data.id),
        exchangeOffice: parent ?
            parent.data.id && Number(parent.data.id) :
            data.exchangeOffice && Number(data.exchangeOffice),
        from: data.from,
        to: data.to,
        in: data.in && Number(data.in),
        out: data.out && Number(data.out),
        reserve: data.reserve && Number(data.reserve),
        date: data.date && toDateString(data.date),
    };
    check(entity, partial);
    return entity;
}

export function check(entity, partial = false) {
    const {
        isInteger,
        isString,
        isDecimal,
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
    isDecimal(`in`);
    isDecimal(`out`);
    isInteger(`reserve`);
    isDateString(`date`);
}
