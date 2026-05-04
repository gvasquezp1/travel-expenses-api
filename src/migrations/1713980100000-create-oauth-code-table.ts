import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOauthCodeTable1713980100000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'oauth_codes',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'code', type: 'varchar', isUnique: true },
          { name: 'clientId', type: 'varchar' },
          { name: 'userId', type: 'varchar' },
          { name: 'expiresAt', type: 'timestamp' },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('oauth_codes');
  }
}
