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
export function toDateString(str) {
    const d = new Date(str);
    const month = d.getMonth() + 1;
    return `${d.getFullYear()}-${month < 10 ? `0${month}` : month}-${d.getDate()}` +
    ` ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}
