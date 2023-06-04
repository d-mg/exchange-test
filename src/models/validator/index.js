import assert from "node:assert";
import { toDateString } from "../transform/index.js";

function message(msg, entity, property) {
    if (entity) {
        if (msg) {
            return `entity ${entity} needs it's property ${property} ${msg}`;
        }
        return `entity ${entity} needs a property ${property}`;
    }
    if (msg) {
        return `expected value ${msg}`;
    }
    return `expected a value`;
}

export function validator(args) {
    const { name, entity, partial = false, } = args || {};
    if (args) {
        assert(name, `validator needs an entity name`);
        assert(entity, `validator needs an entity object`);
    }

    return {
        isInteger,
        isDecimal,
        isString,
        isCurrencyString,
        isDateString,
    };

    function isInteger(arg) {
        const value = args ? entity[arg] : arg;
        partial || assert(
            value === 0 || value,
            message(null, name, arg)
        );
        value && assert(
            Number.isInteger(value),
            message(`to be an integer`, name, arg)
        );
    }

    function isDecimal(arg) {
        const value = args ? entity[arg] : arg;
        partial || assert(
            value === 0 || value,
            message(null, name, arg)
        );
        value && assert(
            typeof value !== `string` && !isNaN(value - parseFloat(value)),
            message(`to be an integer`, name, arg)
        );
    }

    function isString(arg, length) {
        const value = args ? entity[arg] : arg;
        partial || assert(value, `entity ${name} needs it's property ${arg}`);
        value && assert(
            typeof value === `string`,
            message(`to be an string`, name, arg)
        );
        length && value && assert(
            value.length === 3,
            message(`to be a string of ${length} characters`, name, arg)
        );
    }

    function isCurrencyString(arg) {
        const value = args ? entity[arg] : arg;
        isString(arg);
        value && assert(
            /\d+.\d{2}$/.test(value),
            message(`to be a currency string`, name, arg)
        );
    }

    function isDateString(arg) {
        const value = args ? entity[arg] : arg;
        isString(arg);
        value && assert(
            toDateString(value) === value,
            message(`to be a date string`, name, arg)
        );
    }
}
