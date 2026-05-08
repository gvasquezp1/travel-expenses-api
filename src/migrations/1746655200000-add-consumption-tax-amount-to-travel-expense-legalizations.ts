import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddConsumptionTaxAmountToTravelExpenseLegalizations1746655200000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add tax_indicator_id column
    await queryRunner.addColumn(
      'travel_expense_legalizations',
      new TableColumn({
        name: 'tax_indicator_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    // Add consumption_tax_amount column
    await queryRunner.addColumn(
      'travel_expense_legalizations',
      new TableColumn({
        name: 'consumption_tax_amount',
        type: 'decimal',
        precision: 10,
        scale: 2,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn(
      'travel_expense_legalizations',
      'consumption_tax_amount',
    );
    await queryRunner.dropColumn(
      'travel_expense_legalizations',
      'tax_indicator_id',
    );
  }
}
