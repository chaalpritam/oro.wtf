-- Create schemas
CREATE SCHEMA IF NOT EXISTS "auth";
CREATE SCHEMA IF NOT EXISTS "public";

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create auth schema tables
CREATE TABLE "auth"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auth"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Create public schema tables
CREATE TABLE "public"."Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."TeamMember" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "teamId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."DesignSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "teamId" TEXT,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "DesignSystem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."Token" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "designSystemId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."Component" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "props" JSONB NOT NULL DEFAULT '{}',
    "code" TEXT NOT NULL,
    "previewImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "designSystemId" TEXT NOT NULL,

    CONSTRAINT "Component_pkey" PRIMARY KEY ("id")
);

-- Create indexes
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "auth"."Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "auth"."Session"("sessionToken");
CREATE UNIQUE INDEX "User_email_key" ON "auth"."User"("email");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "auth"."VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "auth"."VerificationToken"("identifier", "token");
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "public"."TeamMember"("teamId", "userId");
CREATE UNIQUE INDEX "Token_designSystemId_name_key" ON "public"."Token"("designSystemId", "name");
CREATE UNIQUE INDEX "Component_designSystemId_name_key" ON "public"."Component"("designSystemId", "name");

-- Add foreign key constraints
ALTER TABLE "auth"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "auth"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "auth"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."Project" ADD CONSTRAINT "Project_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."DesignSystem" ADD CONSTRAINT "DesignSystem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "auth"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."DesignSystem" ADD CONSTRAINT "DesignSystem_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."DesignSystem" ADD CONSTRAINT "DesignSystem_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Token" ADD CONSTRAINT "Token_designSystemId_fkey" FOREIGN KEY ("designSystemId") REFERENCES "public"."DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "public"."Component" ADD CONSTRAINT "Component_designSystemId_fkey" FOREIGN KEY ("designSystemId") REFERENCES "public"."DesignSystem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Enable Row Level Security (RLS)
ALTER TABLE "public"."Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."TeamMember" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."DesignSystem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Token" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Component" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Team members can view their teams" ON "public"."Team"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "public"."TeamMember"
            WHERE "TeamMember"."teamId" = "Team"."id"
            AND "TeamMember"."userId" = auth.uid()
        )
    );

CREATE POLICY "Team members can view team members" ON "public"."TeamMember"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "public"."TeamMember" tm
            WHERE tm."teamId" = "TeamMember"."teamId"
            AND tm."userId" = auth.uid()
        )
    );

CREATE POLICY "Team members can view projects" ON "public"."Project"
    FOR SELECT
    USING (
        "createdById" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "public"."TeamMember"
            WHERE "TeamMember"."teamId" = "Project"."teamId"
            AND "TeamMember"."userId" = auth.uid()
        )
    );

CREATE POLICY "Team members can view design systems" ON "public"."DesignSystem"
    FOR SELECT
    USING (
        "isPublic" = true
        OR "createdById" = auth.uid()
        OR EXISTS (
            SELECT 1 FROM "public"."TeamMember"
            WHERE "TeamMember"."teamId" = "DesignSystem"."teamId"
            AND "TeamMember"."userId" = auth.uid()
        )
    );

CREATE POLICY "Team members can view tokens" ON "public"."Token"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "public"."DesignSystem" ds
            LEFT JOIN "public"."TeamMember" tm ON tm."teamId" = ds."teamId"
            WHERE ds."id" = "Token"."designSystemId"
            AND (ds."isPublic" = true OR ds."createdById" = auth.uid() OR tm."userId" = auth.uid())
        )
    );

CREATE POLICY "Team members can view components" ON "public"."Component"
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM "public"."DesignSystem" ds
            LEFT JOIN "public"."TeamMember" tm ON tm."teamId" = ds."teamId"
            WHERE ds."id" = "Component"."designSystemId"
            AND (ds."isPublic" = true OR ds."createdById" = auth.uid() OR tm."userId" = auth.uid())
        )
    ); 