CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"channelId" uuid NOT NULL,
	"content" text DEFAULT '' NOT NULL
);
