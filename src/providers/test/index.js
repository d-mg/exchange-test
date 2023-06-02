let destroyed = false;

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

export async function save({ entity, }) {
    if (destroyed) {
        throw new Error(`Operation failed, provider destroyed`);
    }
    const randomError = getRandom(0, 100);
    const randomExecution = getRandom(0, 1000);

    await new Promise((resolve, reject) => setTimeout(async () => {
        if (randomError > 25) {
            console.log(`saved: `, JSON.stringify(entity, null, 2));
            resolve();
        } else {
            reject(new Error(`something went wrong`));
        }
    }, randomExecution));
}

export function destroy() {
    console.log(`running provider cleanup`);
    destroyed = true;
}
