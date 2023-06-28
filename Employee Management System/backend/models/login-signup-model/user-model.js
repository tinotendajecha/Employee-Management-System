const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;


class User {
    constructor(id, email, password, is_admin, username) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.is_admin = is_admin;
        this.username = username;
    }
    //Database connection
    static async getConnection() {
      const connection = await mysql.createConnection({
        host,
        user,
        database,
      });
  
      return connection;
    }

    //Function which checks if the table exists
    static async ensureTableExists() {
        const connection = await mysql.createConnection({
          host,
          user,
          database,
        });
    
        const [[result]] = await connection.query(`
          SELECT COUNT(*) as count FROM information_schema.tables
          WHERE table_schema = '${database}'
          AND table_name = 'users'
        `);
    
        const tableExists = result.count;
    
        if (tableExists === 0) {
          await connection.query(`
            CREATE TABLE users (
              id int NOT NULL AUTO_INCREMENT,
              email varchar(255) NOT NULL UNIQUE,
              username varchar(255) NOT NULL,
              password varchar(255) NOT NULL,
              is_admin varchar(255) NOT NULL,
              PRIMARY KEY (id)
            )
          `);
        }
    
        connection.close();
      }

    static async create(email, password, is_admin, username) {
        const connection = await User.getConnection();

        await User.ensureTableExists()

        // Insert the user into the table
        const sql = `
        INSERT INTO users (email, password, is_admin, username)
        VALUES (?, ?, ?, ?)
      `;

        const [results] = await connection.query(sql, [email, password, is_admin, username]);

        connection.close();

        return results;
    }

    static async findById(id) {
      //calling the database connection
      const connection = await User.getConnection();
      
      //checking if the table exists
      await User.ensureTableExists()

      const sql = `
        SELECT * FROM users WHERE id = ?
      `;

        const [results] = await connection.query(sql, [id]);

        connection.close();

        return results[0];
    }

    static async findByEmail(email) {
        // calling the database connection
        const connection = await User.getConnection();

        //Checking if the table exists
        await User.ensureTableExists()

        const sql = `
            SELECT * FROM users WHERE email = ?
        `;
        const [rows] = await connection.query(sql , [email]);
        connection.close();

        return rows[0];
    }

    
}

module.exports = User;