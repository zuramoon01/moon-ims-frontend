import {
	PGDATABASE,
	PGHOST,
	PGPASSWORD,
	PGPORT,
	PGUSER,
} from "$env/static/private";
import pg from "pg";
const { Client } = pg;

export const client = new Client({
	user: PGUSER,
	password: PGPASSWORD,
	host: PGHOST,
	database: PGDATABASE,
	port: parseInt(PGPORT),
	//   ssl?: any, // passed directly to node.TLSSocket, supports all tls.connect options
	//   types?: any, // custom type parsers
	//   statement_timeout?: number, // number of milliseconds before a statement in query will time out, default is no timeout
	//   query_timeout?: number, // number of milliseconds before a query call will timeout, default is no timeout
	//   application_name?: string, // The name of the application that created this Client instance
	//   connectionTimeoutMillis?: number, // number of milliseconds to wait for connection, default is no timeout
	//   idle_in_transaction_session_timeout?: number
});

await client.connect();
