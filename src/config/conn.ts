import { DataSource } from "typeorm";

export const config: any = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'grocery',
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/config/migrations/*.js'],
    cli: {
        migrationsDir: "./config/migrations"
    }
}

const dataSource = new DataSource(config);
export default dataSource