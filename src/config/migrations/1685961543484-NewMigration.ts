import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1685961543484 implements MigrationInterface {
    name = 'NewMigration1685961543484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`discount_price\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`reset_password_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`reset_password_token\` varchar(100) NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_f091e86a234693a49084b4c2c86\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_dccd1ec2d6f5644a69adf163bc1\``);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`user_id\` \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`product_id\` \`product_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`qty\` \`qty\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`price\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_f091e86a234693a49084b4c2c86\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_dccd1ec2d6f5644a69adf163bc1\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_dccd1ec2d6f5644a69adf163bc1\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_f091e86a234693a49084b4c2c86\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`price\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`qty\` \`qty\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`product_id\` \`product_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_dccd1ec2d6f5644a69adf163bc1\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_f091e86a234693a49084b4c2c86\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`reset_password_token\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`reset_password_token\` varchar(500) NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`discount_price\` decimal NULL`);
    }

}
