
import { sql } from 'drizzle-orm';
import { integer, pgTable, varchar, date, jsonb, pgEnum, primaryKey, text, uuid  } from "drizzle-orm/pg-core";

/** 書籍資訊 */
export const booksInfo = pgTable("books_info", {
  book_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  isbn: varchar({ length: 20 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  subjects: text().array().notNull(), 
  publisher: varchar({ length: 100 }),
  publish_date: date().notNull(), // publish_date: date({ mode: "string" }).notNull(),
  info: jsonb(), // pcture_url , library_url
});
/** 作者資訊 */
export const authorsInfo = pgTable("authors_info", {
  author_id: integer('author_id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  info: jsonb(), 
});
/** 作者、書籍關係 */
export const relation_books_authors = pgTable("relation_books_authors", {
  book_id: integer().notNull().references(() => booksInfo.book_id, { onDelete: 'cascade' }),
  author_id: integer().notNull().references(() => authorsInfo.author_id, { onDelete: 'cascade' }),
}, (table) => ([
  primaryKey({ columns: [table.book_id, table.author_id] })
]));

/** 圖書館分館 */
export const branch = pgTable("branch", {
  branch_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  info: jsonb(),
});

export const bookItemEnum = pgEnum("status", ["available", "checked_out", "reserved", "lost"]);
/** 書籍館藏 */
export const bookItems = pgTable("book_items", {
  bookItem_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  book_id: integer().notNull().references(() => booksInfo.book_id, { onDelete: 'cascade' }),
  branch_id: integer().notNull().references(() => branch.branch_id, { onDelete: 'cascade' }),
  call_number: uuid().notNull().default(sql`gen_random_uuid()`),
  status: bookItemEnum().notNull().default("available"),
  info: jsonb(),
});

export const roleEnum = pgEnum("role", ["admin", "librarian", "formal_user"]);
/** 使用者 */
export const users = pgTable("users", {
  user_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: roleEnum().notNull().default("formal_user"),
  info: jsonb(), // 密碼放這裡？
});

export const borrowStatusEnum = pgEnum("borrow_status", ["borrowed", "returned", "overdue", "lost", "other"]);
/** 借閱紀錄 */
export const borrowRecords = pgTable("borrow_records", {
  record_id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer().notNull().references(() => users.user_id, { onDelete: 'cascade' }),
  bookItem_id: integer().notNull().references(() => bookItems.bookItem_id, { onDelete: 'cascade' }),
  borrow_date: date().notNull(),
  due_date: date().notNull(),
  return_date: date(),
  status: borrowStatusEnum().notNull().default("borrowed"),
  info: jsonb(),
});
