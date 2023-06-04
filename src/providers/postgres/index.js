import { getClient } from './client.js';
import {
    EXCHANGE_OFFICE,
    EXCHANGE,
    RATE,
    COUNTRY
} from "../../constants.js";

const config = {
    [EXCHANGE_OFFICE]: {
        table: `exchange_office`,
        props: `"id", "name", "country"`,
        placeholders: `$1, $2, $3`,
        values: (data) => [
            data.id,
            data.name,
            data.country,
        ],
    },
    [EXCHANGE]: {
        table: `exchange`,
        props: `"exchange_office", "from", "to", "ask", "bid", "date"`,
        placeholders: `$1, $2, $3, $4, $5, $6`,
        values: (data) => [
            data.exchangeOffice,
            data.from,
            data.to,
            data.ask,
            data.bid,
            data.date,
        ],
    },
    [RATE]: {
        table: `rate`,
        props: `"exchange_office", "from", "to", "in", "out", "reserve", "date"`,
        placeholders: `$1, $2, $3, $4, $5, $6, $7`,
        values: (data) => [
            data.exchangeOffice,
            data.from,
            data.to,
            data.in,
            data.out,
            data.reserve,
            data.date,
        ],
    },
    [COUNTRY]: {
        table: `country`,
        props: `"code", "name"`,
        placeholders: `$1, $2`,
        values: (data) => [
            data.code,
            data.name,
        ],
    },
};

export async function save(entity, data) {
    const { table, props, placeholders, values, } = config[entity];
    const response = await getClient().query(
        `INSERT INTO ${table}(${props}) VALUES(${placeholders}) RETURNING *`,
        values(data)
    );
    // TODO: remove logging
    console.log(response.rows[0]);
}

export async function batchExchange({ limit, from = 0, }) {
    const { rows, } = await getClient()
        .query(`
            SELECT * FROM "exchange"
            WHERE "bid" IS NULL
            AND "id" > $1
            ORDER BY "id"
            LIMIT $2;
        `,
        [
            from,
            limit,
        ]);
    return rows;
}

export async function getRate(props) {
    const response = getClient().query(`
        SELECT * FROM "rate"
        WHERE "exchange_office" = $1
        AND "date" <= $2
        AND "from" = $3
        AND "to" = $4
        ORDER BY "date" DESC
        LIMIT 1;
    `,
    [
        props.exchangeOffice,
        props.date,
        props.from,
        props.to,
    ]);

    return response.rows[0];
}

export async function updateExchangeWithBid(props) {
    getClient().query(`
        UPDATE exchange
        SET bid = $1
        WHERE id = $2;
    `,
    [
        props.bid,
        props.id,
    ]);
}

export async function destroy() {
    getClient().end();
    console.log(`destroyed postgres client`);
}
