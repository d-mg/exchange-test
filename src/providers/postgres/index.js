import { getClient } from './client.js';
import {
    EXCHANGE_OFFICE,
    EXCHANGE,
    RATE,
    COUNTRY
} from "../../constants.js";

const saveData = {
    [EXCHANGE_OFFICE]: {
        table: `exchange_office`,
        props: `"id", "name", "country"`,
        placeholders: `$1, $2, $3`,
        values: ({ data, }) => [
            data.id,
            data.name,
            data.country,
        ],
    },
    [EXCHANGE]: {
        table: `exchange`,
        props: `"exchange_office", "from", "to", "ask", "bid", "date"`,
        placeholders: `$1, $2, $3, $4, $5, $6`,
        values: ({ data, parent, }) => [
            parent.data.id,
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
        values: ({ data, parent, }) => [
            parent.data.id,
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
        values: ({ data, }) => [
            data.code,
            data.name,
        ],
    },
};

export async function save({ entity, data, parent, }) {
    const { table, props, placeholders, values, } = saveData[entity];
    const response = await getClient().query(
        `INSERT INTO ${table}(${props}) VALUES(${placeholders}) RETURNING *`,
        values({ data, parent, })
    );
    // TODO: remove logging
    console.log(response.rows[0]);
}

export async function destroy() {
    getClient().end();
}
