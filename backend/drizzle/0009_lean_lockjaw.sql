CREATE TABLE "contacts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"subject" varchar(50) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"message" varchar DEFAULT '' NOT NULL,
	CONSTRAINT "contacts_email_unique" UNIQUE("email")
);
