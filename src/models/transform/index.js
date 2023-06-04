export function toCurrencyString(str) {
    const number = Math.round(Number(str) * 100);
    const [before, after,] = String(number / 100).split(`.`);
    return `${before}.${
        after ?
            after.length > 1 ?
                after :
                `${after}0`
            : `00`
    }`;
}
