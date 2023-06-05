import assert from "node:assert";
import express from 'express';
import { getProvider } from "../providers/get-provider.js";
const app = express();

const providerArg = process.argv[2];
assert(providerArg, `provider missing as first argument`);
const provider = getProvider(providerArg);

app.get(`/`, async (req, res) => {
    const top = await provider.getTopByCountry();
    res.send(`<pre>${JSON.stringify(top, null,2)}</pre>`);
});

app.listen(8080, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log(`App started at port 8080`);
    }
});
