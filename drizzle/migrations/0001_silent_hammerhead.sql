CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"uid" text,
	"firstName" text,
	"lastName" text,
	"email" text,
	CONSTRAINT "user_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
DROP TABLE "user_key";--> statement-breakpoint
DROP TABLE "user_session";--> statement-breakpoint
DROP TABLE "auth_user";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
