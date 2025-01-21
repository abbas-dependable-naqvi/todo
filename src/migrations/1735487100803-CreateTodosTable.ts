import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTodoTableMigration1649246385000
  implements MigrationInterface
{
  name = 'UpdateTodoTableMigration1649246385000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'todo_state') THEN
          CREATE TYPE "todo_state" AS ENUM('pending', 'in_progress', 'completed');
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE "todo" (
        "id" SERIAL NOT NULL, 
        "title" character varying NOT NULL, 
        "description" character varying, 
        "state" "todo_state" NOT NULL DEFAULT 'pending',
        "userId" integer NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        "deletedAt" TIMESTAMP, 
        CONSTRAINT "PK_todo_id" PRIMARY KEY ("id")
      );
      CREATE INDEX "IDX_todo_userId" ON "todo" ("userId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_todo_userId"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "todo"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "todo_state"`);
  }
}
