import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1686055474985 implements MigrationInterface {
    name = 'NewMigration1686055474985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NULL, \`phone\` bigint NULL, \`addressline\` varchar(100) NOT NULL, \`city\` varchar(30) NOT NULL, \`state\` varchar(20) NOT NULL, \`pincode\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, UNIQUE INDEX \`IDX_55b1d8a5bfb2e76de30e69572f\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`offer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`discount_percentage\` int NOT NULL, \`original_price\` int NOT NULL, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`category_id\` int NULL, \`product_id\` int NULL, UNIQUE INDEX \`REL_8b3e3957b956adce7cc07d2831\` (\`product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD CONSTRAINT \`FK_35cd6c3fafec0bb5d072e24ea20\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_0a5e12233c4acc6faffbee423e2\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_8b3e3957b956adce7cc07d2831f\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_8b3e3957b956adce7cc07d2831f\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_0a5e12233c4acc6faffbee423e2\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP FOREIGN KEY \`FK_35cd6c3fafec0bb5d072e24ea20\``);
        await queryRunner.query(`DROP INDEX \`REL_8b3e3957b956adce7cc07d2831\` ON \`offer\``);
        await queryRunner.query(`DROP TABLE \`offer\``);
        await queryRunner.query(`DROP INDEX \`IDX_55b1d8a5bfb2e76de30e69572f\` ON \`address\``);
        await queryRunner.query(`DROP TABLE \`address\``);
    }

}
