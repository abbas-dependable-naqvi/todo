import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserAndTodoTables1737961180149
  implements MigrationInterface
{
  name = 'UpdateUserAndTodoTables1737961180149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX "public"."IDX_todo_userId"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "createdAt"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "updatedAt"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "user_email_key"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "email"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "email" character varying(128) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email")
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying(30) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "createdAt"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "updatedAt"
            SET DEFAULT now()
        `);
    await queryRunner.query(`
            ALTER TABLE "todo" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ADD "title" character varying(256) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "todo" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ADD "description" character varying(512)
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."todo_state"
            RENAME TO "todo_state_old"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."todo_state_enum" AS ENUM('pending', 'in_progress', 'completed')
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "state" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "state" TYPE "public"."todo_state_enum" USING "state"::"text"::"public"."todo_state_enum"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "state"
            SET DEFAULT 'pending'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."todo_state_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ADD CONSTRAINT "FK_1e982e43f63a98ad9918a86035c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "todo" DROP CONSTRAINT "FK_1e982e43f63a98ad9918a86035c"
        `);
    await queryRunner.query(`
            CREATE TYPE "public"."todo_state_old" AS ENUM('pending', 'in_progress', 'completed')
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "state" DROP DEFAULT
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "state" TYPE "public"."todo_state_old" USING "state"::"text"::"public"."todo_state_old"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "state"
            SET DEFAULT 'pending'
        `);
    await queryRunner.query(`
            DROP TYPE "public"."todo_state_enum"
        `);
    await queryRunner.query(`
            ALTER TYPE "public"."todo_state_old"
            RENAME TO "todo_state"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo" DROP COLUMN "description"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ADD "description" character varying
        `);
    await queryRunner.query(`
            ALTER TABLE "todo" DROP COLUMN "title"
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ADD "title" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "updatedAt"
            SET DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "todo"
            ALTER COLUMN "createdAt"
            SET DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "password"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "password" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22"
        `);
    await queryRunner.query(`
            ALTER TABLE "user" DROP COLUMN "email"
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD "email" character varying NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ADD CONSTRAINT "user_email_key" UNIQUE ("email")
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "updatedAt"
            SET DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            ALTER TABLE "user"
            ALTER COLUMN "createdAt"
            SET DEFAULT CURRENT_TIMESTAMP
        `);
    await queryRunner.query(`
            CREATE INDEX "IDX_todo_userId" ON "todo" ("userId")
        `);
  }
}
