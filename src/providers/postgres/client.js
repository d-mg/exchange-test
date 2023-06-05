import pg from 'pg';

let client = null;

export function getClient() {
    if (!client) {
        client = new pg.Pool({
            host: process.env.POSTGRES_HOST || `localhost`,
            port: process.env.POSTGRES_PORT || 5432,
            database: process.env.POSTGRES_DB || `postgres`,
            user: process.env.POSTGRES_USER || `postgres`,
            password: process.env.POSTGRES_PASSWORD || `postgres`,
        });
        console.log(`created postgres client`);
    }

    return client;
}
