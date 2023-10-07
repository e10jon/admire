-- CreateTable
CREATE TABLE "WikidataSearch" (
    "query" TEXT NOT NULL,
    "results" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WikidataSearch_pkey" PRIMARY KEY ("query")
);

-- CreateTable
CREATE TABLE "WikidataPerson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "listEntriesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "WikidataPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomPerson" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "listEntriesCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CustomPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListEntry" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "customPersonId" INTEGER,
    "wikidataPersonId" TEXT,
    "listId" INTEGER NOT NULL,

    CONSTRAINT "ListEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomPerson_name_idx" ON "CustomPerson"("name");

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_customPersonId_fkey" FOREIGN KEY ("customPersonId") REFERENCES "CustomPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_wikidataPersonId_fkey" FOREIGN KEY ("wikidataPersonId") REFERENCES "WikidataPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListEntry" ADD CONSTRAINT "ListEntry_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
