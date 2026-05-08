import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLineIdToTaxIndicators1746655300000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'tax_indicators',
      new TableColumn({
        name: 'line_id',
        type: 'uuid',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tax_indicators', 'line_id');
  }
}
