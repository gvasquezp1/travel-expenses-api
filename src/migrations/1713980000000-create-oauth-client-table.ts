import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateOauthClientTable1713980000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'oauth_clients',
        columns: [
          { name: 'id', type: 'int', isPrimary: true, isGenerated: true, generationStrategy: 'increment' },
          { name: 'clientId', type: 'varchar', isUnique: true },
          { name: 'clientSecret', type: 'varchar' },
          { name: 'redirectUris', type: 'text' },
          { name: 'enabled', type: 'boolean', default: true },
          { name: 'name', type: 'varchar', isNullable: true },
          { name: 'scopes', type: 'text', isNullable: true },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('oauth_clients');
  }
}
