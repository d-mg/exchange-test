import * as printProvider from './print/index.js';
import * as testProvider from './test/index.js';
import * as postgresProvider from './postgres/index.js';

export function getProvider(provider) {
    switch (provider) {
    case `print`:
        return printProvider;
    case `test`:
        return testProvider;
    case `postgres`:
        return postgresProvider;

    default:
        throw new Error(
            `Provider ${provider} not implemented`
        );
    }
}
