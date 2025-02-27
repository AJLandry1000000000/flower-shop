import 'dotenv/config';
export default {
    client: 'pg',
    connection: {
      host: `${process.env.DB_HOST}`,
      user: `${process.env.DB_USER}`,
      password: `${process.env.DB_USER_PASSWORD}`,
      database: `${process.env.DB_NAME}`,
      port: `${process.env.DB_PORT}`
    },
    migrations: {
      directory: './migrations'
    },
    seeds: {
      directory: './seeds'
    }
  };