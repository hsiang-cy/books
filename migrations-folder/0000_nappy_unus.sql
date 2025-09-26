CREATE TYPE "public"."status" AS ENUM('available', 'checked_out', 'reserved', 'lost');--> statement-breakpoint
CREATE TYPE "public"."borrow_status" AS ENUM('borrowed', 'returned', 'overdue', 'lost', 'other');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('admin', 'librarian', 'formal_user');--> statement-breakpoint
CREATE TABLE "authors_info" (
	"author_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "authors_info_author_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "book_items" (
	"bookItem_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "book_items_bookItem_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"book_id" integer NOT NULL,
	"branch_id" integer NOT NULL,
	"call_number" uuid DEFAULT gen_random_uuid() NOT NULL,
	"status" "status" DEFAULT 'available' NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "books_info" (
	"book_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "books_info_book_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"isbn" varchar(20) NOT NULL,
	"title" varchar(255) NOT NULL,
	"subjects" text[] NOT NULL,
	"publisher" varchar(100),
	"publish_date" date NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "borrow_records" (
	"record_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "borrow_records_record_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"bookItem_id" integer NOT NULL,
	"borrow_date" date NOT NULL,
	"due_date" date NOT NULL,
	"return_date" date,
	"status" "borrow_status" DEFAULT 'borrowed' NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "branch" (
	"branch_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "branch_branch_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"info" jsonb
);
--> statement-breakpoint
CREATE TABLE "relation_books_authors" (
	"book_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	CONSTRAINT "relation_books_authors_book_id_author_id_pk" PRIMARY KEY("book_id","author_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'formal_user' NOT NULL,
	"info" jsonb,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "book_items" ADD CONSTRAINT "book_items_book_id_books_info_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books_info"("book_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "book_items" ADD CONSTRAINT "book_items_branch_id_branch_branch_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branch"("branch_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "borrow_records" ADD CONSTRAINT "borrow_records_bookItem_id_book_items_bookItem_id_fk" FOREIGN KEY ("bookItem_id") REFERENCES "public"."book_items"("bookItem_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relation_books_authors" ADD CONSTRAINT "relation_books_authors_book_id_books_info_book_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books_info"("book_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "relation_books_authors" ADD CONSTRAINT "relation_books_authors_author_id_authors_info_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors_info"("author_id") ON DELETE cascade ON UPDATE no action;