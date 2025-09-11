import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEvaluationFieldsToFormAnswers1757561798000 implements MigrationInterface {
    name = 'AddEvaluationFieldsToFormAnswers1757561798000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "form_answers" 
            ADD "isCorrect" boolean,
            ADD "feedback" text,
            ADD "score" real
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "form_answers" 
            DROP COLUMN "isCorrect",
            DROP COLUMN "feedback",
            DROP COLUMN "score"
        `);
    }
}