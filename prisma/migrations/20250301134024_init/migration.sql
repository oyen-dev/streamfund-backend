-- CreateEnum
CREATE TYPE "AnalyticType" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CREDIT', 'DEPOSIT');

-- CreateTable
CREATE TABLE "Bio" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT,
    "image" TEXT,
    "x" TEXT,
    "tiktok" TEXT,
    "instagram" TEXT,
    "youtube" TEXT,
    "website" TEXT,
    "streamerId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,

    CONSTRAINT "Bio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuration" (
    "id" TEXT NOT NULL,
    "alert" JSONB,
    "mediashare" JSONB,
    "qr_code" JSONB,
    "marquee" JSONB,
    "subhaton" JSONB,
    "voting" JSONB,
    "milestone" JSONB,
    "live_ads" JSONB,
    "streamerId" TEXT NOT NULL,

    CONSTRAINT "Configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "chain" INTEGER NOT NULL,
    "decimal" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Viewer" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "usd_total_support" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Viewer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Streamer" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "stream_key" TEXT NOT NULL,
    "usd_total_support" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Streamer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Support" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "usd_amount" DOUBLE PRECISION NOT NULL,
    "data" JSONB NOT NULL,
    "tokenId" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "revenueId" TEXT,

    CONSTRAINT "Support_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopSupport" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "streamerId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,

    CONSTRAINT "TopSupport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopSupporter" (
    "id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "count" INTEGER NOT NULL,
    "streamerId" TEXT NOT NULL,
    "viewerId" TEXT NOT NULL,

    CONSTRAINT "TopSupporter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revenue" (
    "id" TEXT NOT NULL,
    "type" "TransactionType" NOT NULL,
    "adddress" TEXT NOT NULL,
    "chain" INTEGER NOT NULL,
    "usd_total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsStreamerRevenue" (
    "id" TEXT NOT NULL,
    "type" "AnalyticType" NOT NULL,
    "usd_amount" DOUBLE PRECISION NOT NULL,
    "streamerId" TEXT NOT NULL,

    CONSTRAINT "AnalyticsStreamerRevenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsGenerousViewer" (
    "id" TEXT NOT NULL,
    "type" "AnalyticType" NOT NULL,
    "usd_amount" DOUBLE PRECISION NOT NULL,
    "viewerId" TEXT NOT NULL,

    CONSTRAINT "AnalyticsGenerousViewer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsMostUsedToken" (
    "id" TEXT NOT NULL,
    "type" "AnalyticType" NOT NULL,
    "used_count" INTEGER NOT NULL,
    "used_amount" DOUBLE PRECISION NOT NULL,
    "tokenId" TEXT NOT NULL,

    CONSTRAINT "AnalyticsMostUsedToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bio_username_key" ON "Bio"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Bio_streamerId_key" ON "Bio"("streamerId");

-- CreateIndex
CREATE UNIQUE INDEX "Bio_viewerId_key" ON "Bio"("viewerId");

-- CreateIndex
CREATE UNIQUE INDEX "Configuration_streamerId_key" ON "Configuration"("streamerId");

-- CreateIndex
CREATE UNIQUE INDEX "Streamer_address_key" ON "Streamer"("address");

-- AddForeignKey
ALTER TABLE "Bio" ADD CONSTRAINT "Bio_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bio" ADD CONSTRAINT "Bio_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuration" ADD CONSTRAINT "Configuration_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_toId_fkey" FOREIGN KEY ("toId") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_revenueId_fkey" FOREIGN KEY ("revenueId") REFERENCES "Revenue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSupport" ADD CONSTRAINT "TopSupport_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSupport" ADD CONSTRAINT "TopSupport_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSupporter" ADD CONSTRAINT "TopSupporter_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSupporter" ADD CONSTRAINT "TopSupporter_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsStreamerRevenue" ADD CONSTRAINT "AnalyticsStreamerRevenue_streamerId_fkey" FOREIGN KEY ("streamerId") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsGenerousViewer" ADD CONSTRAINT "AnalyticsGenerousViewer_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsMostUsedToken" ADD CONSTRAINT "AnalyticsMostUsedToken_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
