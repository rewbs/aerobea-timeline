-- CreateTable
CREATE TABLE "PartyColour" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "colour" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartyColour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PartyColour_name_key" ON "PartyColour"("name");
