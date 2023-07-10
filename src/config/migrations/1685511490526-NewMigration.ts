import { MigrationInterface, QueryRunner } from "typeorm";


export class NewMigration1685511490526 implements MigrationInterface {
    name = 'NewMigration1685511490526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, \`image_url\` varchar(200) NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`first_name\` varchar(30) NOT NULL, \`last_name\` varchar(30) NOT NULL, \`phone\` bigint NOT NULL, \`email\` varchar(50) NOT NULL, \`password\` varchar(200) NOT NULL, \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user', \`reset_password_token\` varchar(100) NULL, \`reset_password_token_expire_time\` timestamp NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_8e1f623798118e629b46a9e629\` (\`phone\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NULL, \`phone\` bigint NULL, \`addressline\` varchar(100) NOT NULL, \`city\` varchar(30) NOT NULL, \`state\` varchar(20) NOT NULL, \`pincode\` int NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, UNIQUE INDEX \`IDX_55b1d8a5bfb2e76de30e69572f\` (\`phone\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(30) NOT NULL, \`description\` varchar(200) NOT NULL, \`image_url\` text NOT NULL, \`price\` decimal(10,2) NOT NULL, \`qty\` int NOT NULL DEFAULT '1', \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`category_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`product_id\` int NOT NULL, \`qty\` int NOT NULL, \`price\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`offer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`discount_percentage\` int NOT NULL, \`original_price\` int NOT NULL, \`start_date\` date NOT NULL, \`end_date\` date NOT NULL, \`is_active\` tinyint NOT NULL DEFAULT '1', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`category_id\` int NULL, \`product_id\` int NULL, UNIQUE INDEX \`REL_8b3e3957b956adce7cc07d2831\` (\`product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD CONSTRAINT \`FK_35cd6c3fafec0bb5d072e24ea20\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_0dce9bc93c2d2c399982d04bef1\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_f091e86a234693a49084b4c2c86\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_dccd1ec2d6f5644a69adf163bc1\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_0a5e12233c4acc6faffbee423e2\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`offer\` ADD CONSTRAINT \`FK_8b3e3957b956adce7cc07d2831f\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_8b3e3957b956adce7cc07d2831f\``);
        await queryRunner.query(`ALTER TABLE \`offer\` DROP FOREIGN KEY \`FK_0a5e12233c4acc6faffbee423e2\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_dccd1ec2d6f5644a69adf163bc1\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_f091e86a234693a49084b4c2c86\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_0dce9bc93c2d2c399982d04bef1\``);
        await queryRunner.query(`DROP INDEX \`REL_8b3e3957b956adce7cc07d2831\` ON \`offer\``);
        await queryRunner.query(`DROP TABLE \`offer\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP FOREIGN KEY \`FK_35cd6c3fafec0bb5d072e24ea20\``);
        await queryRunner.query(`DROP TABLE \`cart\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP INDEX \`IDX_55b1d8a5bfb2e76de30e69572f\` ON \`address\``);
        await queryRunner.query(`DROP TABLE \`address\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_8e1f623798118e629b46a9e629\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
    }

}
