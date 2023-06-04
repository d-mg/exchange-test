import { getClient } from './client.js';
import {
    EXCHANGE_OFFICE,
    EXCHANGE,
    RATE,
    COUNTRY
} from "../../constants.js";
import { create as createExchangeOffice } from "../../models/exchange-office.js";
import { create as createExchange } from "../../models/exchange.js";
import { create as createRate } from "../../models/rate.js";
import { create as createCountry } from "../../models/country.js";

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
        createFromPostgres(row) {
            return createExchangeOffice({
                id: row.id,
                name: row.name,
                country: row.country,
            });
        },
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
        createFromPostgres(row) {
            return createExchange({
                id: row.id,
                exchangeOffice: row.exchange_office,
                from: row.from,
                to: row.to,
                ask: row.ask,
                bid: row.bid,
                date: row.date,
            }, true); // TODO: Remove partial after adding bids
        },
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
        createFromPostgres(row) {
            return createRate({
                id: row.id,
                exchangeOffice: row.exchange_office,
                from: row.from,
                to: row.to,
                in: row.in,
                out: row.out,
                reserve: row.reserve,
                date: row.date,

            });
        },
    },
    [COUNTRY]: {
        table: `country`,
        props: `"code", "name"`,
        placeholders: `$1, $2`,
        values: (data) => [
            data.code,
            data.name,
        ],
        createFromPostgres(row) {
            return createCountry({
                code: row.code,
                name: row.name,
            });
        },
    },
};

export async function save(entity, data) {
    const { table, props, placeholders, values, } = config[entity];
    await getClient().query(
        `INSERT INTO ${table}(${props}) VALUES(${placeholders})`,
        values(data)
    );
}

export async function batchExchange({ limit, from = 0, }) {
    const { table, createFromPostgres, } = config[EXCHANGE];
    const response = await getClient()
        .query(`
            SELECT * FROM "${table}"
            WHERE "bid" IS NULL
            AND "id" > $1
            ORDER BY "id"
            LIMIT $2;
        `,
        [
            from,
            limit,
        ]);

    return response.rows.map(createFromPostgres);
}

export async function getRateForExchange(exchange) {
    const { table, createFromPostgres, } = config[RATE];
    const response = await getClient().query(`
        SELECT * FROM "${table}"
        WHERE "exchange_office" = $1
        AND "date" <= $2
        AND "from" = $3
        AND "to" = $4
        ORDER BY "date" DESC
        LIMIT 1;
    `,
    [
        exchange.exchangeOffice,
        exchange.date,
        exchange.from,
        exchange.to,
    ]);

    return response.rows.length > 0 ?
        createFromPostgres(response.rows[0]) :
        null;
}

export async function updateExchangeWithBid(props) {
    await getClient().query(`
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
    await getClient().end();
    console.log(`destroyed postgres client`);
}
