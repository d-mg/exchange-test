import assert from "node:assert";

export function createRetryable({
    time,
    max,
    fn,
    onActionSuccess = () => {},
    onActionError = () => {},
    onError = () => {},
}) {
    assert(time, `a retryable needs a time`);
    assert(max, `a retryable needs a max amount of retries`);
    assert(fn, `a retryable needs a function to execute`);
    return async function retry(arg, n = 0) {
        try {
            const result = await fn.call(null, arg);
            await onActionSuccess({ arg, result, });
            return result;
        } catch (error) {
            n++;
            if (n >= max) {
                await onError({ error, arg, });
                return;
            }
            const retryTime = time * n;
            await onActionError({ error, arg, retryIn: retryTime / 1000, });
            await new Promise(resolve => setTimeout(async () => {
                await retry(arg, n);
                resolve();
            }, retryTime * n));
        }
    };
}
