const mysql = require('mysql2/promise');
require('dotenv').config();

const LeaveBalances = require('../employee-models/LeaveBalances');

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class Employee {
  constructor(id, firstName, lastName, email, phoneNumber, hireDate, jobId, managerId, departmentId, userId) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.hireDate = hireDate;
    this.jobId = jobId;
    this.managerId = managerId;
    this.departmentId = departmentId;
    this.userId = userId;
  }

  // Database connection
  static async getConnection() {
    const connection = await mysql.createConnection({
      host,
      user,
      database,
    });

    return connection;
  }

  // Function to ensure the table exists
  static async ensureTableExists() {
    const connection = await mysql.createConnection({
      host,
      user,
      database,
    });

    const [[result]] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables
      WHERE table_schema = '${database}'
      AND table_name = 'employees'
    `);

    const tableExists = result.count;

    if (tableExists === 0) {
      await connection.query(`
      CREATE TABLE employees (
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(20) NOT NULL,
        hire_date VARCHAR(20),
        job_id INT,
        manager_id INT,
        department_id INT,
        PRIMARY KEY (id),
        FOREIGN KEY (email) REFERENCES users(email),
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (manager_id) REFERENCES users(id),
        FOREIGN KEY (department_id) REFERENCES departments(id)
      );
      `);
    }

    connection.close();
  }

  static async create(firstName, lastName, email, phoneNumber, hireDate, jobId, managerId, departmentId) {
    const connection = await Employee.getConnection();
    
    await Employee.ensureTableExists();
  
    const sql = `
      INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_id, manager_id, department_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await connection.query(sql, [firstName, lastName, email, phoneNumber, hireDate, jobId, managerId, departmentId]);
  
    const insertedRowId = result.insertId;

    // Create the leave tables which allocates the leave days for each employee
    // 100 days for each employee in their entire career
    const leaveBalances = LeaveBalances.createLeaveBalance(insertedRowId, 100, 100);
  
    const selectSql = `
      SELECT * FROM employees WHERE id = ?
    `;
    
    const [selectedRow] = await connection.query(selectSql, [insertedRowId]);
    
    connection.close();
    
    return selectedRow[0];
  }
  
  

  static async findById(id) {
    const connection = await Employee.getConnection();

    await Employee.ensureTableExists();

    const sql = `
      SELECT * FROM employees WHERE id = ?
    `;

    const [results] = await connection.query(sql, [id]);

    connection.close();

    return results[0];
  }

  static async findByManagersId(managersId) {
    const connection = await Employee.getConnection();

    await Employee.ensureTableExists();

    const sql = `
      SELECT * FROM employees WHERE manager_id = ?
    `
    const [results] = await connection.query(sql, [managersId]);

    connection.close();

    return results;
  }

  // This function is going to be used to perform a check of whether a person is an employee or not yet an employeee
  // If they are an employee they will be existing in this employees table
  static async findByUserEmail(email){
    const connection = await Employee.getConnection();

    await Employee.ensureTableExists();

    const sql = `
      SELECT * FROM employees WHERE email = ?
    `

    const [results] = await connection.query(sql, [email]);

    connection.close();
    return results[0]
  }

  static async findAll() {
    const connection = await Employee.getConnection();

    await Employee.ensureTableExists();

    const sql = `
      SELECT * FROM employees
    `;

    const [results] = await connection.query(sql);

    connection.close();

    return results;
  }
}

module.exports = Employee;
