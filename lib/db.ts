import mysql from "mysql2/promise";

const sslEnabled = process.env.NODE_ENV === "production";

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(sslEnabled
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

console.log("[db] config", {
  host: process.env.DB_HOST ?? "",
  port: Number(process.env.DB_PORT) || 0,
  user: process.env.DB_USER ? "set" : "missing",
  database: process.env.DB_NAME ?? "",
  sslEnabled,
});
