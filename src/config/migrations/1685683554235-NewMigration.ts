import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1685683554235 implements MigrationInterface {
    name = 'NewMigration1685683554235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_id\` varchar(255) NOT NULL, \`order_datetime\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`status\` enum ('pending', 'accepted', 'delivered', 'canceled') NOT NULL DEFAULT 'pending', \`qty\` int NOT NULL DEFAULT '1', \`price\` decimal(10,2) NOT NULL, \`discount_price\` decimal(10,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`product_id\` int NULL, \`user_id\` int NULL, \`address_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`discount_price\` decimal(10,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_dccd1ec2d6f5644a69adf163bc1\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_f091e86a234693a49084b4c2c86\``);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`qty\` \`qty\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`price\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`product_id\` \`product_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`user_id\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_dccd1ec2d6f5644a69adf163bc1\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_f091e86a234693a49084b4c2c86\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_539ede39e518562dfdadfddb492\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_199e32a02ddc0f47cd93181d8fd\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_f07603e96b068aae820d4590270\` FOREIGN KEY (\`address_id\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_f07603e96b068aae820d4590270\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_199e32a02ddc0f47cd93181d8fd\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_539ede39e518562dfdadfddb492\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_f091e86a234693a49084b4c2c86\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_dccd1ec2d6f5644a69adf163bc1\``);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`user_id\` \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`product_id\` \`product_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`price\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` CHANGE \`qty\` \`qty\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_f091e86a234693a49084b4c2c86\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_dccd1ec2d6f5644a69adf163bc1\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`discount_price\``);
        await queryRunner.query(`DROP TABLE \`order\``);
    }

}
