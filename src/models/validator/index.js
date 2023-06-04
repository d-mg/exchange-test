import assert from "node:assert";

export function validator({ name, entity, partial = false, }) {
    assert(name, `validator needs an entity name`);
    assert(entity, `validator needs an entity object`);

    return {
        isInteger,
        isDecimal,
        isString,
        isCurrencyString,
        isDateString,
    };

    function isInteger(property) {
        const value = entity[property];
        partial || assert(
            value === 0 || value,
            `entity ${name} needs a property ${property}`
        );
        value && assert(
            Number.isInteger(value),
            `entity ${name} needs it's property ${property} to be an integer`
        );
    }

    function isDecimal(property) {
        const value = entity[property];
        partial || assert(
            value === 0 || value,
            `entity ${name} needs a property ${property}`
        );
        value && assert(
            typeof value !== `string` && !isNaN(value - parseFloat(value)),
            `entity ${name} needs it's property ${property} to be an integer`
        );
    }

    function isString(property, length) {
        const value = entity[property];
        partial || assert(value, `entity ${name} needs a property ${property}`);
        value && assert(
            typeof value === `string`,
            `entity ${name} needs it's property ${property} to be a string`
        );
        length && value && assert(
            value.length === 3,
            `entity ${name} needs it's property ${property} to be a string of ${length} characters`
        );
    }

    function isCurrencyString(property) {
        const value = entity[property];
        isString(property);
        value && assert(
            /\d+.\d{2}$/.test(value),
            `entity ${name} needs it's property ${property} to be a currency string`
        );
    }

    function isDateString(property) {
        const value = entity[property];
        isString(property);
        const d = new Date(value);
        const month = d.getMonth() + 1;
        const date = `${d.getFullYear()}-${month < 10 ? `0${month}` : month}-${d.getDate()}` +
        ` ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
        value && assert(
            date === value,
            `entity ${name} needs it's property ${property} to be a date string`
        );
    }
}
