import { DataSource } from 'typeorm';
import { User, Todo } from './entities';
import * as dotenv from 'dotenv';
import {
  dbType,
  defaultDBHost,
  defaultDBName,
  defaultDBPassword,
  defaultDBPort,
  defaultDBUsername,
} from './const';

dotenv.config();

const AppDataSource = new DataSource({
  type: dbType,
  host: process.env.DB_HOST || defaultDBHost,
  port: parseInt(process.env.DB_PORT || defaultDBPort, 10),
  username: process.env.DB_USERNAME || defaultDBUsername,
  password: process.env.DB_PASSWORD || defaultDBPassword,
  database: process.env.DB_NAME || defaultDBName,
  entities: [User, Todo],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

export default AppDataSource;
