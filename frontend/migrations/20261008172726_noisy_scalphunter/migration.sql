CREATE TABLE "direct_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid()
);
--> statement-breakpoint
CREATE TABLE "dm_participants" (
	"id" serial PRIMARY KEY,
	"dm_id" uuid NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "dm_participants" ADD CONSTRAINT "dm_participants_dm_id_direct_messages_id_fkey" FOREIGN KEY ("dm_id") REFERENCES "direct_messages"("id");--> statement-breakpoint
ALTER TABLE "dm_participants" ADD CONSTRAINT "dm_participants_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");