import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateJsonContentColumn1757623300000 implements MigrationInterface {
    name = 'UpdateJsonContentColumn1757623300000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Modificar la columna jsonContent para asegurar que pueda manejar contenido grande
        await queryRunner.query(`
            ALTER TABLE "contents" 
            ALTER COLUMN "jsonContent" TYPE TEXT
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertir cambios si es necesario
        await queryRunner.query(`
            ALTER TABLE "contents" 
            ALTER COLUMN "jsonContent" TYPE TEXT
        `);
    }
}