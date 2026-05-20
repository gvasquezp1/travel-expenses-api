import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCityMunicipalityToTravelExpenseLegalizations1747699200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE travel_expense_legalizations
        ADD COLUMN IF NOT EXISTS city VARCHAR(100),
        ADD COLUMN IF NOT EXISTS municipality VARCHAR(100)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE travel_expense_legalizations
        DROP COLUMN IF EXISTS city,
        DROP COLUMN IF EXISTS municipality
    `);
  }
}
