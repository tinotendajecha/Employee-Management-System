const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class Department{
    constructor(id, department_name){
        this.id = id;
        this.department_name = department_name;
    }

    //database connection
    static async getConnection() {
        const connection = await mysql.createConnection({
          host,
          user,
          database,
        });
    
        return connection;
      }

    //checking if the departments table exist
    static async ensureTableExists(){
        const connection = await this.getConnection();

        const [[result]] = await connection.query(`
        SELECT COUNT(*) as count FROM information_schema.tables
        WHERE table_schema = '${database}'
        AND table_name = 'departments'
        `);

        const tableExists = result.count;

        if (tableExists === 0) {
        await connection.query(`
            CREATE TABLE departments (
            id int NOT NULL AUTO_INCREMENT,
            department_name varchar(255) NOT NULL UNIQUE,
            PRIMARY KEY (id)
            )
        `);
        }

        connection.close();
    }

    //Getting all departments
    static async getAllDepartments() {
        await this.ensureTableExists();
    
        const connection = await this.getConnection();
    
        const [rows] = await connection.query(`
          SELECT * FROM departments
        `);
    
        connection.close();
    
        return rows.map(row => new Department(row.id, row.department_name));
    }

    //Getting department by Id
    static async getDepartmentById(id) {
        await this.ensureTableExists();
    
        const connection = await this.getConnection();
    
        const [rows] = await connection.query(`
          SELECT * FROM departments WHERE id = ?
        `, [id]);
    
        connection.close();
    
        if (rows.length === 0) {
          throw new Error('Department not found');
        }
    
        const row = rows[0];
    
        return new Department(row.id, row.department_name);
      }
    
    
static async create(name) {
    await this.ensureTableExists();
  
    const connection = await this.getConnection();
  
    // Check if a department with the given name already exists
    const [existingDepartment] = await connection.query(`
      SELECT * FROM departments WHERE department_name = ?
    `, [name]);
  
    if (existingDepartment.length > 0) {
      throw new Error('Department already exists 🤔');
    }
  
    const sql = `
      INSERT INTO departments (department_name)
      VALUES (?)
    `;
  
    const [results, ] = await connection.query(sql, [name]);
  
    connection.close();
  
    return new Department(results.insertId, name);
  }

    
    //Deleting an existing department
    static async deleteById(id) {
        await this.ensureTableExists();
    
        const connection = await this.getConnection();
    
        const sql = `
          DELETE FROM departments WHERE id = ?
        `;
    
        await connection.query(sql, [id]);
    
        connection.close();
      }
}

module.exports = Department;