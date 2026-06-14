ALTER TABLE "votes" DROP CONSTRAINT "votes_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "votes" ADD COLUMN "guest_fingerprint" varchar(64);--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;