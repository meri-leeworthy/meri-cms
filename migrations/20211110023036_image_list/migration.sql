/*
  Warnings:

  - You are about to drop the column `image` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image";

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "image" JSONB,
    "description" TEXT NOT NULL DEFAULT E'',

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
