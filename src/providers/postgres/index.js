import { getClient } from './client.js';
import {
    EXCHANGE_OFFICE,
    EXCHANGE,
    RATE,
    COUNTRY
} from "../../constants.js";

export async function save({ entity, data, parent, }) {
    // TODO: remove logging response
    let response;
    switch (entity) {
    case EXCHANGE_OFFICE:
        response = await saveExchangeOffice(data);
        break;
    case EXCHANGE:
        response = await saveExchange(data, parent);
        break;
    case RATE:
        response = await saveRate(data, parent);
        break;
    case COUNTRY:
        response = await saveCountry(data);
        break;
    default:
        throw new Error(`unknown entity`);
    }
    console.log(response.rows[0]);
}

export async function destroy() {
    getClient().end();
}

async function saveExchangeOffice(data) {
    return getClient().query(
        `INSERT INTO exchange_office(
            "id",
            "name",
            "country"
        ) VALUES($1, $2, $3) RETURNING *`,
        [
            data.id,
            data.name,
            data.country,
        ]);
}

async function saveExchange(data, parent) {
    return getClient().query(
        `INSERT INTO exchange(
            "exchange_office",
            "from",
            "to",
            "ask",
            "bid",
            "date"
        ) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
            parent.data.id,
            data.from,
            data.to,
            data.ask,
            data.bid,
            data.date,
        ]);
}

async function saveRate(data, parent) {
    return getClient().query(
        `INSERT INTO rate(
            "exchange_office",
            "from",
            "to",
            "in",
            "out",
            "reserve",
            "date"
        ) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
            parent.data.id,
            data.from,
            data.to,
            data.in,
            data.out,
            data.reserve,
            data.date,
        ]);
}

async function saveCountry(data) {
    return getClient().query(
        `INSERT INTO country(
            "code",
            "name"
        ) VALUES($1, $2) RETURNING *`,
        [
            data.code,
            data.name,
        ]);
}
