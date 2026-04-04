import mysql from "mysql2/promise";

let pool: mysql.Pool;

export const connectMySQL = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const connection = await pool.getConnection();
    console.log("MySQL connected");
    connection.release();
  } catch (error) {
    console.error("MySQL connection failed", error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!pool) {
    throw new Error("Database not connected");
  }
  return pool;
};