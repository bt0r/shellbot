import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class Twitter1542925966894 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(new Table({
            name: "twitter",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "twitter_id",
                    type: "varchar",
                    length: "50",
                    isUnique: true,
                },
                {
                    name: "date",
                    type: "datetime",
                },
                {
                    name: "channel",
                    type: "varchar",
                    length: "100",
                },
                {
                    name: "username",
                    type: "varchar",
                    length: "50",
                },
            ],
        }), true);

        await queryRunner.createIndex("twitter", new TableIndex({
            name: "IDX_TWITTER_ID",
            columnNames: ["twitter_id", "channel", "username"],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        queryRunner.dropTable("twitter");
        queryRunner.dropIndex("twitter", "IDX_TWITTER_ID");
    }

}
