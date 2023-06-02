# exchange-test

## Usage

### Parser

Usage:

```bash
# Run the parser with "npm start" and provide a provider and a dump file
# It will use the given provider to save the entities from the dump
npm start <provider> <file>

# alias for "npm start"
npm run parser

# alias for "npm start postgres data/dump.txt"
npm run parser:postgres

# alias for "npm start test data/dump.txt"
npm run parser:test

# alias for "npm start print data/dump.txt"
npm run parser:print
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

*TODO*

## TODO

- calculate bid
- model validation
- api
- questions
