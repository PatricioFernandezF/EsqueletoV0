-- CreateTable
CREATE TABLE "cards" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "difficulty" VARCHAR(50),

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);
