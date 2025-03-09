/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AnalyticsGenerousViewer` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `AnalyticsGenerousViewer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AnalyticsGenerousViewer` table. All the data in the column will be lost.
  - You are about to drop the column `viewerId` on the `AnalyticsGenerousViewer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AnalyticsMostUsedToken` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `AnalyticsMostUsedToken` table. All the data in the column will be lost.
  - You are about to drop the column `tokenId` on the `AnalyticsMostUsedToken` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AnalyticsMostUsedToken` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `AnalyticsStreamerFeeCollector` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `AnalyticsStreamerFeeCollector` table. All the data in the column will be lost.
  - You are about to drop the column `streamerId` on the `AnalyticsStreamerFeeCollector` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `AnalyticsStreamerFeeCollector` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Bio` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Bio` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Bio` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Configuration` table. All the data in the column will be lost.
  - You are about to drop the column `chain` on the `FeeCollector` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `FeeCollector` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `FeeCollector` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FeeCollector` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Streamer` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Streamer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Streamer` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `feeCollectorId` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `fromId` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `toId` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `tokenId` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Support` table. All the data in the column will be lost.
  - You are about to drop the column `chain` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Token` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TopSupport` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TopSupport` table. All the data in the column will be lost.
  - You are about to drop the column `streamerId` on the `TopSupport` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TopSupport` table. All the data in the column will be lost.
  - You are about to drop the column `viewerId` on the `TopSupport` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `TopSupporter` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `TopSupporter` table. All the data in the column will be lost.
  - You are about to drop the column `streamerId` on the `TopSupporter` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `TopSupporter` table. All the data in the column will be lost.
  - You are about to drop the column `viewerId` on the `TopSupporter` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Viewer` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Viewer` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Viewer` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `AnalyticsGenerousViewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewer_id` to the `AnalyticsGenerousViewer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_id` to the `AnalyticsMostUsedToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `AnalyticsMostUsedToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamer_id` to the `AnalyticsStreamerFeeCollector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `AnalyticsStreamerFeeCollector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Bio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Configuration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chain_id` to the `FeeCollector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `FeeCollector` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Streamer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fee_collector_id` to the `Support` table without a default value. This is not possible if the table is not empty.
  - Added the required column `from_id` to the `Support` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to_id` to the `Support` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_id` to the `Support` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Support` table without a default value. This is not possible if the table is not empty.
  - Added the required column `chain_id` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Token` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamer_id` to the `TopSupport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TopSupport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewer_id` to the `TopSupport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streamer_id` to the `TopSupporter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `TopSupporter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `viewer_id` to the `TopSupporter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Viewer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnalyticsGenerousViewer" DROP CONSTRAINT "AnalyticsGenerousViewer_viewerId_fkey";

-- DropForeignKey
ALTER TABLE "AnalyticsMostUsedToken" DROP CONSTRAINT "AnalyticsMostUsedToken_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "AnalyticsStreamerFeeCollector" DROP CONSTRAINT "AnalyticsStreamerFeeCollector_streamerId_fkey";

-- DropForeignKey
ALTER TABLE "Support" DROP CONSTRAINT "Support_feeCollectorId_fkey";

-- DropForeignKey
ALTER TABLE "Support" DROP CONSTRAINT "Support_fromId_fkey";

-- DropForeignKey
ALTER TABLE "Support" DROP CONSTRAINT "Support_toId_fkey";

-- DropForeignKey
ALTER TABLE "Support" DROP CONSTRAINT "Support_tokenId_fkey";

-- DropForeignKey
ALTER TABLE "TopSupport" DROP CONSTRAINT "TopSupport_streamerId_fkey";

-- DropForeignKey
ALTER TABLE "TopSupport" DROP CONSTRAINT "TopSupport_viewerId_fkey";

-- DropForeignKey
ALTER TABLE "TopSupporter" DROP CONSTRAINT "TopSupporter_streamerId_fkey";

-- DropForeignKey
ALTER TABLE "TopSupporter" DROP CONSTRAINT "TopSupporter_viewerId_fkey";

-- AlterTable
ALTER TABLE "AnalyticsGenerousViewer" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
DROP COLUMN "viewerId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "viewer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AnalyticsMostUsedToken" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "tokenId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "token_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AnalyticsStreamerFeeCollector" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "streamerId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "streamer_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Bio" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Configuration" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "FeeCollector" DROP COLUMN "chain",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "chain_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Streamer" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Support" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "feeCollectorId",
DROP COLUMN "fromId",
DROP COLUMN "toId",
DROP COLUMN "tokenId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "fee_collector_id" TEXT NOT NULL,
ADD COLUMN     "from_id" TEXT NOT NULL,
ADD COLUMN     "to_id" TEXT NOT NULL,
ADD COLUMN     "token_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "chain",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "chain_id" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TopSupport" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "streamerId",
DROP COLUMN "updatedAt",
DROP COLUMN "viewerId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "streamer_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "viewer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TopSupporter" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "streamerId",
DROP COLUMN "updatedAt",
DROP COLUMN "viewerId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "streamer_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "viewer_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Viewer" DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Chain" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "block_explorer_url" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Support" ADD CONSTRAINT "Support_fee_collector_id_fkey" FOREIGN KEY ("fee_collector_id") REFERENCES "FeeCollector"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSupport" ADD CONSTRAINT "TopSupport_streamer_id_fkey" FOREIGN KEY ("streamer_id") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSupport" ADD CONSTRAINT "TopSupport_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSupporter" ADD CONSTRAINT "TopSupporter_streamer_id_fkey" FOREIGN KEY ("streamer_id") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopSupporter" ADD CONSTRAINT "TopSupporter_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeeCollector" ADD CONSTRAINT "FeeCollector_chain_id_fkey" FOREIGN KEY ("chain_id") REFERENCES "Chain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsStreamerFeeCollector" ADD CONSTRAINT "AnalyticsStreamerFeeCollector_streamer_id_fkey" FOREIGN KEY ("streamer_id") REFERENCES "Streamer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsGenerousViewer" ADD CONSTRAINT "AnalyticsGenerousViewer_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "Viewer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsMostUsedToken" ADD CONSTRAINT "AnalyticsMostUsedToken_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
