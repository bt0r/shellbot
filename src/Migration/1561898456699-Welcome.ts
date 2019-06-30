import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class Welcome1561898456699 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn("user", new TableColumn({
            name: "created_on",
            type: "datetime",
            default: null,
            isNullable: true,
        }));

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("user", "created_on");
    }
}
