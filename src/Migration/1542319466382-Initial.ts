import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class Initial1542319466382 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        // User
        await queryRunner.createTable(new Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "discord_id",
                    type: "varchar",
                    length: "255",
                },
                {
                    name: "name",
                    type: "varchar",
                    length: "255",
                    charset: "utf8mb4",
                },
                {
                    name: "status",
                    type: "varchar",
                    length: "255",
                },
                {
                    name: "last_connection",
                    type: "datetime",
                },
            ],
        }), true);

        // Command Called
        await queryRunner.createTable(new Table({
            name: "command_called",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "count",
                    type: "int",
                    length: "11",
                },
                {
                    name: "command_name",
                    type: "varchar",
                    length: "255",
                    charset: "utf8mb4",
                },
                {
                    name: "latest_use",
                    type: "datetime",
                },
                {
                    name: "user_id",
                    type: "int",
                    length: "11",
                    isUnique: true,
                },
            ],
        }), true);

        await queryRunner.createIndex("user", new TableIndex({
            name: "IDX_USER_DISCORDID",
            columnNames: ["discord_id"],
        }));

        await queryRunner.createForeignKey("command_called", new TableForeignKey({
            columnNames: ["user_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "user",
            onDelete: "CASCADE",
        }));

        await queryRunner.createIndex("command_called", new TableIndex({
            name: "IDX_COMMAND_CALLED_USER",
            columnNames: ["command_name", "user_id"],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("command_called");
        await queryRunner.dropTable("user");
        await queryRunner.dropIndex("command_called", "IDX_COMMAND_CALLED_USER");
        await queryRunner.dropIndex("user", "IDX_USER_DISCORDID");
    }

}
