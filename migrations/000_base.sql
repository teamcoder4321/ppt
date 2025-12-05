-- Base schema generated from blueprint.models

-- Authentication and session management tables

-- Migrations tracking table
CREATE TABLE IF NOT EXISTS "migrations" (
  "id" SERIAL PRIMARY KEY,
  "filename" VARCHAR(255) UNIQUE NOT NULL,
  "executed_at" TIMESTAMP DEFAULT NOW()
);

-- Users table (required for authentication)
CREATE TABLE IF NOT EXISTS "users" (
  "userid" UUID PRIMARY KEY,
  "oauthid" TEXT NOT NULL UNIQUE,
  "source" TEXT NOT NULL CHECK("source" IN ('google', 'facebook', 'apple', 'github', 'userpass')),
  "username" TEXT NOT NULL,
  "email" TEXT,
  "avatarurl" TEXT,
  "userlevel" INTEGER NOT NULL DEFAULT 1 CHECK("userlevel" IN (0, 1, 2)),
  "usertier" INTEGER NOT NULL DEFAULT 0,
  "lastlogindate" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createddate" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isactive" INTEGER NOT NULL DEFAULT 1
);

-- Indexes for Users table
CREATE INDEX IF NOT EXISTS idx_users_oauthid ON "users"("oauthid");
CREATE INDEX IF NOT EXISTS idx_users_email ON "users"("email");
CREATE INDEX IF NOT EXISTS idx_users_usertier ON "users"("usertier");

-- UserSession table
CREATE TABLE IF NOT EXISTS "usersession" (
  "id" UUID PRIMARY KEY,
  "sessiontoken" TEXT NOT NULL UNIQUE,
  "userid" UUID NOT NULL,
  "expirationdate" TEXT NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE
);

-- Indexes for UserSession table
CREATE INDEX IF NOT EXISTS idx_session_token ON "usersession"("sessiontoken");
CREATE INDEX IF NOT EXISTS idx_session_user ON "usersession"("userid");
CREATE INDEX IF NOT EXISTS idx_session_expiry ON "usersession"("expirationdate");

-- OAuthTokens table
CREATE TABLE IF NOT EXISTS "oauthtokens" (
  "id" UUID PRIMARY KEY,
  "userid" UUID NOT NULL,
  "provider" TEXT NOT NULL CHECK("provider" IN ('google', 'facebook', 'apple', 'github', 'userpass')),
  "accesstoken" TEXT NOT NULL,
  "refreshtoken" TEXT,
  "expiresat" TEXT,
  "createdat" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedat" TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("userid") REFERENCES "users"("userid") ON DELETE CASCADE
);

-- Indexes for OAuthTokens table
CREATE INDEX IF NOT EXISTS idx_oauth_user ON "oauthtokens"("userid");
CREATE INDEX IF NOT EXISTS idx_oauth_provider ON "oauthtokens"("userid", "provider");

-- Model: contactsubmissions
CREATE TABLE IF NOT EXISTS "contactsubmissions" (
  "id" UUID NOT NULL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "subject" VARCHAR(500),
  "message" TEXT NOT NULL,
  "status" VARCHAR(50),
  "created_at" TIMESTAMP
);

-- Model: chatsessions
CREATE TABLE IF NOT EXISTS "chatsessions" (
  "id" UUID NOT NULL PRIMARY KEY,
  "user1id" UUID NOT NULL,
  "user2id" UUID,
  "session_type" VARCHAR(50) NOT NULL,
  "status" VARCHAR(50) NOT NULL,
  "started_at" TIMESTAMP NOT NULL,
  "ended_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: userpreferences
CREATE TABLE IF NOT EXISTS "userpreferences" (
  "id" UUID NOT NULL PRIMARY KEY,
  "userid" UUID NOT NULL,
  "preferred_chat_type" VARCHAR(50),
  "interests" TEXT,
  "language" VARCHAR(50),
  "is_available" BOOLEAN NOT NULL,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: userbans
CREATE TABLE IF NOT EXISTS "userbans" (
  "id" UUID NOT NULL PRIMARY KEY,
  "userid" UUID NOT NULL,
  "reason" TEXT NOT NULL,
  "banned_at" TIMESTAMP NOT NULL,
  "expires_at" TIMESTAMP,
  "is_permanent" BOOLEAN NOT NULL,
  "banned_by" UUID NOT NULL,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: reports
CREATE TABLE IF NOT EXISTS "reports" (
  "id" UUID NOT NULL PRIMARY KEY,
  "reporter_userid" UUID NOT NULL,
  "reported_userid" UUID NOT NULL,
  "chatsessionsid" UUID,
  "reason" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "status" VARCHAR(50) NOT NULL,
  "created_at" TIMESTAMP NOT NULL,
  "resolved_at" TIMESTAMP,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: sessionmetadata
CREATE TABLE IF NOT EXISTS "sessionmetadata" (
  "id" UUID NOT NULL PRIMARY KEY,
  "chatsessionsid" UUID NOT NULL,
  "duration_seconds" INTEGER,
  "user1_ip_hash" VARCHAR(255),
  "user2_ip_hash" VARCHAR(255),
  "user1_country" VARCHAR(100),
  "user2_country" VARCHAR(100),
  "ended_by" VARCHAR(50),
  "created_at" TIMESTAMP NOT NULL,
  "userid" UUID NOT NULL,
  FOREIGN KEY ("userid") REFERENCES "users" ("userid")
);

-- Model: advertisements
CREATE TABLE IF NOT EXISTS "advertisements" (
  "id" UUID NOT NULL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "ad_type" VARCHAR(50) NOT NULL,
  "target_url" TEXT NOT NULL,
  "placement" VARCHAR(100) NOT NULL,
  "is_active" BOOLEAN NOT NULL,
  "starts_at" TIMESTAMP,
  "ends_at" TIMESTAMP,
  "impressions" INTEGER,
  "clicks" INTEGER,
  "created_at" TIMESTAMP NOT NULL
);

-- Model: advertisementimages
CREATE TABLE IF NOT EXISTS "advertisementimages" (
  "id" UUID NOT NULL PRIMARY KEY,
  "advertisementsid" UUID NOT NULL,
  "image_url" TEXT NOT NULL,
  "is_primary" BOOLEAN NOT NULL,
  "display_order" INTEGER,
  "caption" TEXT
);

-- PasswordAuth table for username/password authentication
CREATE TABLE IF NOT EXISTS "passwordauth" (
  "id" UUID PRIMARY KEY,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "passwordhash" TEXT NOT NULL,
  "salt" TEXT NOT NULL,
  "verificationtoken" TEXT,
  "verificationtokenexpires" TIMESTAMP,
  "emailverified" BOOLEAN DEFAULT FALSE,
  "resettoken" TEXT,
  "resettokenexpires" TIMESTAMP,
  "createdat" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedat" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for PasswordAuth
CREATE INDEX IF NOT EXISTS idx_passwordauth_email ON "passwordauth"("email");
CREATE INDEX IF NOT EXISTS idx_passwordauth_verification_token ON "passwordauth"("verificationtoken");
CREATE INDEX IF NOT EXISTS idx_passwordauth_reset_token ON "passwordauth"("resettoken");
CREATE INDEX IF NOT EXISTS idx_passwordauth_email_verified ON "passwordauth"("emailverified");

-- FormSubmissions table for storing form data
CREATE TABLE IF NOT EXISTS "form_submissions" (
  "id" SERIAL PRIMARY KEY,
  "timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "form_name" VARCHAR(255) NOT NULL,
  "form_data" JSONB NOT NULL
);

-- Indexes for FormSubmissions
CREATE INDEX IF NOT EXISTS idx_form_submissions_name ON "form_submissions"("form_name");
CREATE INDEX IF NOT EXISTS idx_form_submissions_timestamp ON "form_submissions"("timestamp");
