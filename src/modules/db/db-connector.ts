import {Pool, QueryResult} from "pg";

export class DbConnector {
    private static pool: Pool;

    static init() {
        this.pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'shame',
            password: '123456789',
            port: 5432
        })
    }

    static async query(query: string, variables?: any[]): Promise<QueryResult> {
        return this.pool.query(query, variables)
    }
}
