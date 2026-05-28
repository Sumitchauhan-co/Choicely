ALTER TABLE "polls" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "votes" ADD COLUMN "name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_name_polls_name_fk" FOREIGN KEY ("name") REFERENCES "public"."polls"("name") ON DELETE cascade ON UPDATE no action;