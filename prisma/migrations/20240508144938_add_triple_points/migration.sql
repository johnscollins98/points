-- AlterTable
ALTER TABLE "PointEntry" ADD COLUMN     "wasTriple" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "wasDouble" SET DEFAULT false;
