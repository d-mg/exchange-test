export async function batchExecute({ limit, from = 0, }, batchFn, executeFn) {
    const res = await batchFn({ limit, from, });
    await executeFn(res);
    if (res.length) {
        await batchExecute(
            {
                limit,
                from: res[res.length - 1].id,
            },
            batchFn,
            executeFn
        );
    }
}
