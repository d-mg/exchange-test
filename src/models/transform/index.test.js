import { toCurrencyString } from "./index.js";

describe(`toCurrencyString`, () => {
    it(`transforms "1" into "1.00"`, () => {
        expect(toCurrencyString(`1`)).toBe(`1.00`);
    });

    it(`transforms "1.01" into "1.01"`, () => {
        expect(toCurrencyString(`1.01`)).toBe(`1.01`);
    });

    it(`transforms "1.001" into "1.00"`, () => {
        expect(toCurrencyString(`1.001`)).toBe(`1.00`);
    });

    it(`transforms "1.005" into "1.00"`, () => {
        expect(toCurrencyString(`1.005`)).toBe(`1.00`);
    });

    it(`transforms "1.006" into "1.01"`, () => {
        expect(toCurrencyString(`1.006`)).toBe(`1.01`);
    });

    it(`transforms "1000" into "1000.00"`, () => {
        expect(toCurrencyString(`1000`)).toBe(`1000.00`);
    });
});
