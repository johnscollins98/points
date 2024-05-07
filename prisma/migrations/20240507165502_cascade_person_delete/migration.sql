-- DropForeignKey
ALTER TABLE "PointEntry" DROP CONSTRAINT "PointEntry_personId_fkey";

-- AddForeignKey
ALTER TABLE "PointEntry" ADD CONSTRAINT "PointEntry_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
