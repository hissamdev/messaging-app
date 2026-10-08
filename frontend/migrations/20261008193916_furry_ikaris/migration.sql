CREATE TABLE "friendships" (
	"id" serial PRIMARY KEY,
	"initiator_id" uuid NOT NULL,
	"recipient_id" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_initiator_id_users_id_fkey" FOREIGN KEY ("initiator_id") REFERENCES "users"("id");--> statement-breakpoint
ALTER TABLE "friendships" ADD CONSTRAINT "friendships_recipient_id_users_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id");