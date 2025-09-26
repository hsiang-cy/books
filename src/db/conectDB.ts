import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import 'dotenv/config';
import { pathToFileURL } from 'url';

export class ConnectDB {
    private static instance: ConnectDB;
    private pool: Pool;
    private db: ReturnType<typeof drizzle>;

    private constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,

            max: 20,                    // 最大連接數
            idleTimeoutMillis: 30000,   // 空閒超時
            connectionTimeoutMillis: 2000, // 連接超時
            allowExitOnIdle: false,     // 容器重啟時重連
        });

        this.db = drizzle({ client: this.pool });

        // 處理程式結束時的清理
        process.on('SIGINT', () => this.closeConnection());
        process.on('SIGTERM', () => this.closeConnection());
    }

    static getInstance(): ConnectDB {
        if (!ConnectDB.instance) {
            ConnectDB.instance = new ConnectDB();
        }
        return ConnectDB.instance;
    }

    async testConnection() {
        try {
            await this.db.execute('SELECT 1');
            console.log('資料庫連接成功');
            return true;
        } catch (error) {
            console.error('資料庫連接失败:', error);
            return false;
        }
    }

    getDb() {
        return this.db;
    }

    async closeConnection() {
        if (this.pool) {
            await this.pool.end();
            console.log('資料庫連接已關閉');
        }
    }
}
