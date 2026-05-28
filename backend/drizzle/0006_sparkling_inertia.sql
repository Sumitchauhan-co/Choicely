ALTER TABLE "votes" DROP CONSTRAINT "votes_option_id_polls_id_fk";
--> statement-breakpoint
ALTER TABLE "votes" ADD COLUMN "option" text NOT NULL;--> statement-breakpoint
ALTER TABLE "votes" DROP COLUMN "option_id";