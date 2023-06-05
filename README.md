# exchange-test

- api runs on 8080
- postgres runs on port 5432
  - db: postgres
  - user: postgres
  - password: postgres
- adminer (db admin) runs on port 8081

## Usage

```bash
# Starts the api, postgres and adminer in containers
npm start

# Starts the db uns the parser, calculates bids and updates the db in docker
npm run init

# stops containers and removes volumes/images, deleting data in postgres
npm run clean

# runs only the db (and adminer) so the api or the scripts can connect to it running locally
npm run services

# for running the api locally for development
npm run dev
```

### Parser

Usage:

```bash
# Run parser locally with "npm run parser" and provide a provider and a dump file
# It will use the given provider to save the entities from the dump
npm run parser <provider> <file>

# alias for "npm run parser postgres data/dump.txt"
npm run parser:postgres

# alias for "npm run parser test data/dump.txt"
npm run parser:test

# alias for "npm run parser print data/dump.txt"
npm run parser:print
```

### Calculate bids

Usage:

```bash
# Run calculate-bids locally with "npm run calculate-bids" and provide a provider
# It will use the given provider to get the exchanges with out bid
# and will calculate it updating with the provider
npm run calculate-bids <provider> <file>

# alias for "npm run calculate-bids postgres"
npm run calculate-bids:postgres
```

### Questions

#### How to change the code to support different file format versions?

Would have to rewrite the parser not to use a switch with hardcoded strings.

#### How will the import system change if in the future we need to get this data from a web API?

I would imagine it would be a system consuming an event queue.

#### If in the future it will be necessary to do the calculations using the national bank rate, how could this be added to the system?

By polling or subscribing to some service for the national bank rate

#### How would it be possible to speed up the execution of requests if the task allowed you to update market data once a day or even less frequently? Please explain all possible solutions you could think of

Caching the responses/db queries until the market data changes

## TODO

- fix sql
