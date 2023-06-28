const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class Task {
  constructor(id, title, description, employeeId, managerId, deadline, status) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.employeeId = employeeId;
    this.managerId = managerId;
    this.deadline = deadline;
    this.status = status;
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
      AND table_name = 'tasks'
    `);

    const tableExists = result.count;

    if (tableExists === 0) {
      await connection.query(`
      CREATE TABLE tasks (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        employee_id INT NOT NULL,
        manager_id INT NOT NULL,
        deadline VARCHAR(255) NOT NULL,
        status VARCHAR(20) NOT NULL DEFAULT 'pending',
        PRIMARY KEY (id),
        FOREIGN KEY (employee_id) REFERENCES employees(id),
        FOREIGN KEY (manager_id) REFERENCES users(id)
      );
      `);
    }

    connection.close();
  }

  static async create(title, description, employeeId, managerId, deadline) {
    const connection = await Task.getConnection();

    await Task.ensureTableExists();

    const sql = `
      INSERT INTO tasks (title, description, employee_id, manager_id, deadline)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await connection.query(sql, [title, description, employeeId, managerId, deadline]);

    const insertedRowId = result.insertId;

    const selectSql = `
      SELECT * FROM tasks WHERE id = ?
    `;

    const [selectedRow] = await connection.query(selectSql, [insertedRowId]);

    connection.close();

    return selectedRow[0];
  }

  static async findById(id) {
    const connection = await Task.getConnection();

    await Task.ensureTableExists();

    const sql = `
      SELECT * FROM tasks WHERE id = ?
    `;

    const [results] = await connection.query(sql, [id]);

    connection.close();

    return results[0];
  }

  static async findByEmployeeId(employeeId) {
    const connection = await Task.getConnection();

    await Task.ensureTableExists();

    const sql = `
      SELECT * FROM tasks WHERE employee_id = ?
    `
    const [results] = await connection.query(sql, [employeeId]);

    connection.close();

    return results;
  }

  static async findByManagerId(managerId) {
    const connection = await Task.getConnection();

    await Task.ensureTableExists();

    const sql = `
      SELECT * FROM tasks WHERE manager_id = ?
    `
    const [results] = await connection.query(sql, [managerId]);

    connection.close();

    return results;
  }

  static async findAll() {
    const connection = await Task.getConnection();

    await Task.ensureTableExists();

    const sql = `
      SELECT * FROM tasks
    `;

    const [results] = await connection.query(sql);

    connection.close();

    return results;
  }

  static async update(id, status) {
    const connection = await Task.getConnection();

    await Task.ensureTableExists();

    const sql = `
      UPDATE tasks SET status = ?
      WHERE id = ?
    `;

    await connection.query(sql, [status, id]);

    const updatedTask = await Task.findById(id);

    connection.close();

    return updatedTask;
  }

  static async delete(id) {
    const connection = await Task.getConnection();

    await Task.ensureTableExists();

    const sql = `
      DELETE FROM tasks WHERE id = ?
    `;

    await connection.query(sql, [id]);

    connection.close();
  }
}

module.exports = Task;