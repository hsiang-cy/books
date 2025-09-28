import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { connectDB } from './db/conectDB.js';
import { booksInfo } from './db/schema.js';
import { sql, like, and, eq, SQL } from 'drizzle-orm';

const db = await connectDB();

const app = new Hono()
// const db = ConnectDB.getInstance().getDb();

app.get('/', (c) => c.text('Hello Node.js!'))

app.get('/api/booksInfo', async (c) => {
    try {

        const { title, publisher, subject, limit } = c.req.query();

        // console.log('limit:', limit);
        // console.log('title:', title);
        // console.log('publisher:', publisher);
        // console.log('subject:', subject);
        const arr: SQL[] = []
        if (title) arr.push(like(booksInfo.title, `%${title}%`))
        if (publisher) arr.push(eq(booksInfo.publisher, publisher))
        if (subject) arr.push(sql`${booksInfo.subjects} @> ARRAY[${subject}]`);

        /*
curl -G "localhost:8787/api/booksInfo" \
--data-urlencode "publisher=碁峰" \
--data-urlencode "title=突破" \
--data-urlencode "limit=1"
            */

        const books = await db.select().from(booksInfo)
            .where(
                and(...arr)
            )
            .limit(limit ? Number(limit) : 3);

        return c.json((books.length > 0 ? books : { message: '查無資料' }), 200);
    } catch (err) {
        console.error('查詢錯誤:', err);
        return c.json({ error: '查詢失敗' }, 500);
    }
})

const server = serve({
    fetch: app.fetch,
    port: 8787,
});



// graceful shutdown
process.on('SIGINT', () => {
    server.close()
    process.exit(0)
})
process.on('SIGTERM', () => {
    server.close((err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }
        process.exit(0)
    })
})