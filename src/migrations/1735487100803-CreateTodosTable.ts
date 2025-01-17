import { MigrationInterface, QueryRunner } from 'typeorm';

export class TodoTableMigration1649246385000 implements MigrationInterface {
  name = 'TodoTableMigration1649246385000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "todo_state" AS ENUM('pending', 'in_progress', 'completed');
    `);

    await queryRunner.query(`
      CREATE TABLE "todo" (
        "id" SERIAL NOT NULL, 
        "title" character varying NOT NULL, 
        "description" character varying, 
        "state" "todo_state" NOT NULL DEFAULT 'pending',
        "userId" integer NOT NULL, 
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        "deletedAt" TIMESTAMP, 
        CONSTRAINT "PK_12345" PRIMARY KEY ("id")
      );
      CREATE INDEX "IDX_todo_userId" ON "todo" ("userId");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_todo_userId"`);
    await queryRunner.query(`DROP TABLE "todo"`);
    await queryRunner.query(`DROP TYPE "todo_state"`);
  }
}
