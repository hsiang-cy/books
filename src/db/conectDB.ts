import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from 'pg';
import 'dotenv/config';

// postgresql://sean:scpcskcNh9ZotsU6J931tA7q82mgeUF7@dpg-d3bpr52dbo4c73dk6r30-a.singapore-postgres.render.com/books_project_db_5876?sslmode=prefer
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    allowExitOnIdle: false,     // 容器重啟時重連
})

// export const db = drizzle({ client: pool });
export async function connectDB() {
    try {
        const db = drizzle({ client: pool });
        await db.execute('SELECT 1');
        console.log('資料庫連接成功');
        return db;
    } catch (err) {
        if (err instanceof Error) {
            console.error('資料庫連接失败:', err.message);
            throw err;
        }
        else {
            console.error('連接資料庫時，產生未知錯誤:', err);
            throw new Error('Unknown error');
        }
    }
}


