import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateAppSettingsTable1714000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'app_settings',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'key',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'value',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['string', 'number', 'boolean', 'json'],
            default: "'string'",
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'group',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'isEditable',
            type: 'boolean',
            default: true,
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    // Crear índice en la columna key
    await queryRunner.createIndex(
      'app_settings',
      new TableIndex({
        name: 'IDX_APP_SETTINGS_KEY',
        columnNames: ['key'],
      }),
    );

    // Crear índice en la columna group
    await queryRunner.createIndex(
      'app_settings',
      new TableIndex({
        name: 'IDX_APP_SETTINGS_GROUP',
        columnNames: ['group'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('app_settings', 'IDX_APP_SETTINGS_GROUP');
    await queryRunner.dropIndex('app_settings', 'IDX_APP_SETTINGS_KEY');
    await queryRunner.dropTable('app_settings');
  }
}
