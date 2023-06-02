CREATE TABLE exchange_office (
    "id" integer CONSTRAINT exchange_office_key PRIMARY KEY,
    "name" varchar(100) NOT NULL,
    "country" varchar(3) NOT NULL
);
CREATE TABLE exchange (
    "id" SERIAL CONSTRAINT exchange_key PRIMARY KEY,
    "exchange_office" integer NOT NULL,
    "from" varchar(3) NOT NULL,
    "to" varchar(3) NOT NULL,
    "ask" decimal NOT NULL,
    "bid" decimal,
    "date" date NOT NULL
);
CREATE TABLE rate (
    "id" SERIAL CONSTRAINT rate_key PRIMARY KEY,
    "exchange_office" integer NOT NULL,
    "from" varchar(3) NOT NULL,
    "to" varchar(3) NOT NULL,
    "in" decimal NOT NULL,
    "out" decimal NOT NULL,
    "reserve" decimal NOT NULL,
    "date" date NOT NULL
);
CREATE TABLE country (
    "code" varchar(3) CONSTRAINT country_key PRIMARY KEY,
    "name" varchar(60) NOT NULL
);