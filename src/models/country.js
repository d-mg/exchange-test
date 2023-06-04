import { validator } from "./validator/index.js";
import { COUNTRY } from "../constants.js";

export function create({ data, }, partial = false) {
    const entity = {
        code: data.code,
        name: data.name,
    };
    check(entity, partial);
    return entity;
}

export function check(entity, partial = false) {
    const { isString, } = validator({
        name: COUNTRY,
        entity,
        partial,
    });
    isString(`code`, 3);
    isString(`name`);
}
