-- Make dni optional: many patients (imported from legacy systems) have no DNI on file.
-- A unique NOT NULL column can't hold more than one such patient; NULL values are
-- exempt from the unique index in Postgres, so this allows any number of them.
ALTER TABLE "patient" ALTER COLUMN "dni" DROP NOT NULL;
