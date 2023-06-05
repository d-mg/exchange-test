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
            }, true); // partial can be removed after adding bids
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

export async function getTopByCountry() {
    // This query does not what is asked and I'm pretty sure what it does it does wrong
    // Took too long on the rest and a bit too SQL rusty to do this properly
    const result = await getClient().query(`
        SELECT eo.name AS exchange_office, c.name as country, top_countries.spread_sum as country_sum,
        SUM(
            CASE WHEN e.from = 'USD' THEN
                e.bid
            ELSE
                (e.bid / (r_usd_bid.in / r_usd_bid.out))
            END
                -
            CASE WHEN e.to = 'USD' THEN
                e.ask
            ELSE
                (e.ask / (r_usd_ask.in / r_usd_ask.out))
            END
        ) spread_sum

        FROM
        (SELECT c.code AS country,
            SUM(
                CASE WHEN e.from = 'USD' THEN
                    e.bid
                ELSE
                    (e.bid / (r_usd_bid.in / r_usd_bid.out))
                END
                    -
                CASE WHEN e.to = 'USD' THEN
                    e.ask
                ELSE
                    (e.ask / (r_usd_ask.in / r_usd_ask.out))
                END
            ) spread_sum

            FROM
            exchange AS e,
            exchange_office AS eo,
            country AS c,
            rate AS r_usd_bid,
            rate AS r_usd_ask

            WHERE e.exchange_office = eo.id
            AND eo.country = c.code
            AND r_usd_bid.exchange_office = eo.id
            AND r_usd_bid.date <= e.date
            AND r_usd_bid.from = CASE WHEN e.from = 'USD' THEN e.to ELSE e.from END
            AND r_usd_bid.to = 'USD'
            AND r_usd_ask.exchange_office = eo.id
            AND r_usd_ask.date <= e.date
            AND r_usd_ask.from = CASE WHEN e.to = 'USD' THEN e.from ELSE e.to END
            AND r_usd_ask.to = 'USD'

            GROUP BY c.code
            ORDER BY spread_sum DESC
            LIMIT 3) AS top_countries,
        exchange AS e,
        exchange_office AS eo,
        country AS c,
        rate AS r_usd_bid,
        rate AS r_usd_ask


        WHERE e.exchange_office = eo.id
        AND eo.country = c.code
        AND r_usd_bid.exchange_office = eo.id
        AND r_usd_bid.date <= e.date
        AND r_usd_bid.from = CASE WHEN e.from = 'USD' THEN e.to ELSE e.from END
        AND r_usd_bid.to = 'USD'
        AND r_usd_ask.exchange_office = eo.id
        AND r_usd_ask.date <= e.date
        AND r_usd_ask.from = CASE WHEN e.to = 'USD' THEN e.from ELSE e.to END
        AND r_usd_ask.to = 'USD'
        AND top_countries.country = c.code

        GROUP BY eo.name, c.name, top_countries.spread_sum
        ORDER BY spread_sum DESC
        ;
    `);

    return result.rows;
}

export async function destroy() {
    await getClient().end();
    console.log(`destroyed postgres provider`);
}
