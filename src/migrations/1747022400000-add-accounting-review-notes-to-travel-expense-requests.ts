import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAccountingReviewNotesToTravelExpenseRequests1747022400000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'travel_expense_requests',
      new TableColumn({
        name: 'accountingReviewNotes',
        type: 'text',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('travel_expense_requests', 'accountingReviewNotes');
  }
}
