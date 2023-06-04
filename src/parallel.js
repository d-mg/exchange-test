export function createParallel(max) {
    let running = [];

    return {
        async execute(promise) {
            running.push(promise);

            if (max <= running.length) {
                await Promise.allSettled(running);
                running = [];
            }
        },
        async finish() {
            await Promise.allSettled(running);
        },
    };
}
