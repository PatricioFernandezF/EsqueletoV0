/*
  Warnings:

  - You are about to drop the `cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "cards";

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);
