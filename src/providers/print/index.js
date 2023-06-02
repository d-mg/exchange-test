export function save(data) {
    console.log(JSON.stringify(data, null, 2));
}

export function destroy() {
    console.log(`running provider cleanup`);
}
