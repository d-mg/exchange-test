import { validator } from "./index.js";
import { AssertionError } from "node:assert";

describe(`validator`, () => {
    it(`throws when no entity name`, () => {
        expect(() => validator({})).toThrow(AssertionError);
    });

    it(`throws when no entity`, () => {
        expect(() => validator({ name: `name`, })).toThrow(AssertionError);
    });

    describe(`isInteger`, () => {
        it(`throws when no prop`, () => {
            expect(() =>
                validator({ name: `name`, entity: { }, })
                    .isInteger(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop is not an integer`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: `1`, }, })
                    .isInteger(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop is a decimal`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: 0.1, }, })
                    .isInteger(`prop`)
            ).toThrow(AssertionError);
        });

        it(`doesn't throw when prop is 0`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: 0, }, })
                    .isInteger(`prop`)
            ).not.toThrow(AssertionError);
        });

        describe(`with partial validator`, () => {
            it(`doesn't throw when no prop`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { }, partial: true, })
                        .isInteger(`prop`)
                ).not.toThrow(AssertionError);
            });

            it(`throws when prop is not an integer`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: `1`, }, partial: true, })
                        .isInteger(`prop`)
                ).toThrow(AssertionError);
            });

            it(`throws when prop is a decimal`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: 0.1, }, })
                        .isInteger(`prop`)
                ).toThrow(AssertionError);
            });

            it(`doesn't throw when prop is 0`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: 0, }, })
                        .isInteger(`prop`)
                ).not.toThrow(AssertionError);
            });
        });
    });

    describe(`isDecimal`, () => {
        it(`throws when no prop`, () => {
            expect(() =>
                validator({ name: `name`, entity: { }, })
                    .isDecimal(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop is not an integer`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: `1`, }, })
                    .isDecimal(`prop`)
            ).toThrow(AssertionError);
        });

        it(`doesn't throw when prop is an integer`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: 1, }, })
                    .isDecimal(`prop`)
            ).not.toThrow(AssertionError);
        });

        it(`doesn't throw when prop is 0`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: 0, }, })
                    .isDecimal(`prop`)
            ).not.toThrow(AssertionError);
        });

        it(`doesn't throw when prop is a decimal`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: 0.1, }, })
                    .isDecimal(`prop`)
            ).not.toThrow(AssertionError);
        });

        describe(`with partial validator`, () => {
            it(`doesn't throw when no prop`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { }, partial: true, })
                        .isDecimal(`prop`)
                ).not.toThrow(AssertionError);
            });

            it(`throws when prop is not an integer`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: `1`, }, partial: true, })
                        .isDecimal(`prop`)
                ).toThrow(AssertionError);
            });

            it(`doesn't throw when prop is an integer`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: 1, }, })
                        .isDecimal(`prop`)
                ).not.toThrow(AssertionError);
            });

            it(`doesn't throw when prop is 0`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: 0, }, })
                        .isDecimal(`prop`)
                ).not.toThrow(AssertionError);
            });

            it(`doesn't throw when prop is a decimal`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: 0.1, }, })
                        .isDecimal(`prop`)
                ).not.toThrow(AssertionError);
            });
        });
    });

    describe(`isString`, () => {
        it(`throws when no prop`, () => {
            expect(() =>
                validator({ name: `name`, entity: { }, })
                    .isString(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop is not a string`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: 1, }, })
                    .isString(`prop`)
            ).toThrow(AssertionError);
        });

        describe(`with length`, () => {
            it(`throws when prop is not as long as length`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: `four`, }, })
                        .isString(`prop`, 3)
                ).toThrow(AssertionError);
            });
        });

        describe(`with partial validator`, () => {
            it(`doesn't throw when no prop`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { }, partial: true, })
                        .isString(`prop`)
                ).not.toThrow(AssertionError);
            });

            it(`throws when prop is not a string`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: 1, }, partial: true, })
                        .isString(`prop`)
                ).toThrow(AssertionError);
            });

            describe(`with length`, () => {
                it(`throws when prop is not as long as length`, () => {
                    expect(() =>
                        validator({ name: `name`, entity: { prop: `four`, }, })
                            .isString(`prop`, 3)
                    ).toThrow(AssertionError);
                });
            });
        });
    });

    describe(`isCurrencyString`, () => {
        it(`throws when no prop`, () => {
            expect(() =>
                validator({ name: `name`, entity: { }, })
                    .isCurrencyString(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop is not a string`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: 1, }, })
                    .isCurrencyString(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop has too high accuracy`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: `1.001`, }, })
                    .isCurrencyString(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop has too low accuracy`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: `1.1`, }, })
                    .isCurrencyString(`prop`)
            ).toThrow(AssertionError);
        });

        describe(`with partial validator`, () => {
            it(`doesn't throw when no prop`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { }, partial: true, })
                        .isCurrencyString(`prop`)
                ).not.toThrow(AssertionError);
            });

            it(`throws when prop is not a string`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: 1, }, partial: true, })
                        .isCurrencyString(`prop`)
                ).toThrow(AssertionError);
            });

            it(`throws when prop has too high accuracy`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: `1.001`, }, })
                        .isCurrencyString(`prop`)
                ).toThrow(AssertionError);
            });

            it(`throws when prop has too low accuracy`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: `1.1`, }, })
                        .isCurrencyString(`prop`)
                ).toThrow(AssertionError);
            });
        });
    });

    describe(`isDateString`, () => {
        it(`throws when no prop`, () => {
            expect(() =>
                validator({ name: `name`, entity: { }, })
                    .isDateString(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop is not a string`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: new Date(), }, })
                    .isDateString(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop is not a date string`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: `string`, }, })
                    .isDateString(`prop`)
            ).toThrow(AssertionError);
        });

        it(`throws when prop is not a correct date string`, () => {
            expect(() =>
                validator({ name: `name`, entity: { prop: new Date().toISOString(), }, })
                    .isDateString(`prop`)
            ).toThrow(AssertionError);
        });

        describe(`with partial validator`, () => {
            it(`doesn't throw when no prop`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { }, partial: true, })
                        .isDateString(`prop`)
                ).not.toThrow(AssertionError);
            });

            it(`throws when prop is not a string`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: new Date(), }, partial: true, })
                        .isDateString(`prop`)
                ).toThrow(AssertionError);
            });

            it(`throws when prop is not a date string`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: `string`, }, })
                        .isDateString(`prop`)
                ).toThrow(AssertionError);
            });

            it(`throws when prop is not a correct date string`, () => {
                expect(() =>
                    validator({ name: `name`, entity: { prop: new Date().toISOString(), }, })
                        .isDateString(`prop`)
                ).toThrow(AssertionError);
            });
        });
    });
});
