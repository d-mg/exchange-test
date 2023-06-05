#!/bin/bash

npm run parser:postgres &&
npm run calculate-bids:postgres &&
npm run update-postgres &&
echo "init done";