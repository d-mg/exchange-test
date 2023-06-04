export function save(entity, data) {
    console.log(`${entity}: `, JSON.stringify(data, null, 2));
}

export function destroy() {
    console.log(`destroyed print provider`);
}
