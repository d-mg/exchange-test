import { getClient } from '../providers/postgres/client.js';

console.log(`updating postgres tables`);

await getClient().query(`
    ALTER TABLE "exchange_office"
    ADD FOREIGN KEY ("country")
    REFERENCES "country" ("code");`);

console.log(`created foreign key country in exchange_office`);

await getClient().query(`
    ALTER TABLE "exchange"
    ADD FOREIGN KEY ("exchange_office")
    REFERENCES "exchange_office" ("id"),
    ALTER "bid" DROP DEFAULT,
    ALTER "bid" SET NOT NULL;`);

console.log(`created foreign key exchange_office in exchange and set bid to not be nullable`);

await getClient().query(`
    ALTER TABLE "rate"
    ADD FOREIGN KEY ("exchange_office")
    REFERENCES "exchange_office" ("id");`);
console.log(`created foreign key exchange_office in rate`);

getClient().end();
