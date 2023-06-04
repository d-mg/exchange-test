const failPercent = 50;

let destroyed = false;

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

export async function save() {
    if (destroyed) {
        throw new Error(`Operation failed, provider destroyed`);
    }
    const randomError = getRandom(0, 100);
    const randomExecution = getRandom(0, 1000);

    await new Promise((resolve, reject) => setTimeout(async () => {
        if (randomError > failPercent) {
            resolve();
        } else {
            reject(new Error(`something went wrong`));
        }
    }, randomExecution));
}

export function destroy() {
    destroyed = true;
    console.log(`destroyed test provider`);
}
