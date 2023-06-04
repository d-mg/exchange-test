# exchange-test

## Usage

### Parser

Usage:

```bash
# Run parser with "npm run parser" and provide a provider and a dump file
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
# Run calculate-bids with "npm run calculate-bids" and provide a provider
# It will use the given provider to get the exchanges with out bid
# and will calculate it updating with the provider
npm run calculate-bids <provider> <file>

# alias for "npm run calculate-bids postgres"
npm run calculate-bids:postgres
```

### Database

Usage:

```bash
# Run the postgres db with "npm run postgres" this will start up the db and create tables
# alias for "docker-compose up"
npm run postgres
```

*note: docker and docker-compose need to be installed to run the db*

## Questions

### How to change the code to support different file format versions?

*TODO*

### How will the import system change if in the future we need to get this data from a web API?

*TODO*

### If in the future it will be necessary to do the calculations using the national bank rate, how could this be added to the system?

*TODO*

### How would it be possible to speed up the execution of requests if the task allowed you to update market data once a day or even less frequently?

*TODO*

### Please explain all possible solutions you could think of

*TODO*

## TODO

- refactor scripts for reusability
- refactor prostgres provider for reusability
- api
- questions
