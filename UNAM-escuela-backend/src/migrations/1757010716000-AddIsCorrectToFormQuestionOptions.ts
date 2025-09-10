import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsCorrectToFormQuestionOptions1757010716000 implements MigrationInterface {
    name = 'AddIsCorrectToFormQuestionOptions1757010716000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "form_question_options" 
            ADD "isCorrect" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "form_question_options" 
            DROP COLUMN "isCorrect"
        `);
    }
}