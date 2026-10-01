import { Sequelize } from 'sequelize';
import 'dotenv/config';

// RDS exige SSL. Em aula: aceita o certificado sem validar.
// Em produção: validar com o RDS CA bundle.
const useSsl = process.env.DB_SSL === 'true';

// eslint-disable-next-line import/prefer-default-export
export const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USERNAME,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    logging: false,
    dialectOptions: useSsl ? { ssl: { require: true, rejectUnauthorized: false } } : {},
  },
);
