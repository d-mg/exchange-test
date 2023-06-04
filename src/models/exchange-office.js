import { validator } from "./validator/index.js";
import { EXCHANGE_OFFICE } from "../constants.js";

export function create(data, partial = false) {
    const entity = {
        id: data.id && Number(data.id),
        name: data.name,
        country: data.country,
    };
    check(entity, partial);
    return entity;
}

export function check(entity, partial = false) {
    const { isInteger, isString, } = validator({
        name: EXCHANGE_OFFICE,
        entity,
        partial,
    });
    isInteger(`id`);
    isString(`name`);
    isString(`country`, 3);
}
