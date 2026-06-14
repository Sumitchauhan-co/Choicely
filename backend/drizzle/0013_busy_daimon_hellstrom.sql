ALTER TABLE "votes" 
ALTER COLUMN "option" TYPE text[] 
USING ARRAY["option"];