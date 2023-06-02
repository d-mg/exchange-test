import pg from 'pg';

let client = null;

export function getClient() {
    if (!client) {
        client = new pg.Pool({
            host: `localhost`,
            port: 5432,
            database: `postgres`,
            user: `postgres`,
            password: `postgres`,
        });
        console.log(`created postgres client`);
    }

    return client;
}
