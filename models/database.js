/**
 * Created by David on 07/10/2016.
 */
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres:bas115190594@localhost:5432/postgres';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
    'CREATE TABLE Users(id SERIAL PRIMARY KEY, login VARCHAR(40) not null, password VARCHAR(40) not null)');
query.on('end', () => { client.end(); });

