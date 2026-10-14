-- CreateTable
CREATE TABLE "public"."time_block" (
  "id" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "startTime" TEXT NOT NULL DEFAULT '',
  "endTime" TEXT NOT NULL DEFAULT '',
  "allDay" BOOLEAN NOT NULL DEFAULT false,
  "reason" TEXT NOT NULL DEFAULT '',
  "doctorId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "clinicId" TEXT NOT NULL,

  CONSTRAINT "time_block_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."time_block" ADD CONSTRAINT "time_block_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "public"."clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
