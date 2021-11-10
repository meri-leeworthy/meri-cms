/*
  Warnings:

  - You are about to drop the column `image_extension` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image_filesize` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image_height` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image_id` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image_sizesMeta` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `image_width` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "image_extension",
DROP COLUMN "image_filesize",
DROP COLUMN "image_height",
DROP COLUMN "image_id",
DROP COLUMN "image_sizesMeta",
DROP COLUMN "image_width",
ADD COLUMN     "image" JSONB;
