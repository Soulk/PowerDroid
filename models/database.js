/**
 * Created by David on 07/10/2016.
 */
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:lolilol97@localhost:5433/todo';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
    'CREATE TABLE Users(id SERIAL PRIMARY KEY, login VARCHAR(40) not null, password VARCHAR(40) not null)');
query.on('end', () => { client.end(); });

