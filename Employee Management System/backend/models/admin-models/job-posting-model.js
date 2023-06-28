const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class Job {
  constructor(id, job_title, job_description, job_location, job_salary, job_posted_by, posted_at, department_id) {
    this.id = id;
    this.job_title = job_title;
    this.job_description = job_description;
    this.job_location = job_location;
    this.job_salary = job_salary;
    this.job_posted_by = job_posted_by;
    this.posted_at = posted_at;
    this.department_id = department_id
  }

  static async getConnection() {
    const connection = await mysql.createConnection({
      host,
      user,
      database,
    });

    return connection;
  }

  static async ensureTableExists() {
    const connection = await mysql.createConnection({
      host,
      user,
      database,
    });

    const [[result]] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables
      WHERE table_schema = '${database}'
      AND table_name = 'jobs'
    `);

    const tableExists = result.count;

    if (tableExists === 0) {
      await connection.query(`
        CREATE TABLE jobs (
          id INT NOT NULL AUTO_INCREMENT,
          job_title VARCHAR(255) NOT NULL,
          job_description TEXT NOT NULL,
          job_location VARCHAR(255) NOT NULL,
          job_salary DECIMAL(10, 2) NOT NULL,
          job_posted_by INT NOT NULL,
          department_id INT,
          posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (job_posted_by) REFERENCES users (id),
          FOREIGN KEY (department_id) REFERENCES departments(id)
        )
      `);
    }

    connection.close();
  }

  static async create(job_title, job_description, job_location, job_salary, job_posted_by, department_id) {
    const connection = await this.getConnection();
  
    await this.ensureTableExists();
  
    const checkIfExistsSql = `
      SELECT COUNT(*) as count
      FROM jobs
      WHERE job_title = ? AND job_location = ?
    `;
  
    const [existingJob] = await connection.query(checkIfExistsSql, [job_title, job_location]);
  
    if (existingJob[0].count > 0) {
      throw new Error('Job already exists');
    }
  
    const insertSql = `
      INSERT INTO jobs (job_title, job_description, job_location, job_salary, job_posted_by, department_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
  
    const [results] = await connection.query(insertSql, [job_title, job_description, job_location, job_salary, job_posted_by, department_id]);
  
    connection.close();
  
    return new Job(results.insertId, job_title, job_description,job_location,job_salary,job_posted_by, department_id);
  }
  

  static async findById(id) {
    const connection = await Job.getConnection();
  
    await Job.ensureTableExists();
  
    const sql = `
      SELECT id, job_title, job_description, job_location, job_salary, job_posted_by, posted_at, department_id
      FROM jobs
      WHERE id = ?
    `;
  
    const [rows] = await connection.query(sql, [id]);
  
    connection.close();

    if (rows.length === 0) {
      throw new Error('Job not found 🤔');
    }

    const row = rows[0]
  
    return new Job(row.id, row.job_title, row.job_description, row.job_location, row.job_salary, row.job_posted_by, row.posted_at, row.department_id);
  }

  static async findByTitle(job_title) {
    const connection = await Job.getConnection();

    await Job.ensureTableExists();

    const sql = `
      SELECT * FROM jobs WHERE job_title = ?
    `;

    const [results] = await connection.query(sql, [job_title]);

    connection.close();

    return results[0];
  }

  static async findAll() {
    const connection = await Job.getConnection();

    await Job.ensureTableExists();

    const sql = `
      SELECT * FROM jobs
    `;

    const [results] = await connection.query(sql);

    connection.close();

    return results;
  }

  static async deleteById(id) {
    const connection = await Job.getConnection();
  
    await Job.ensureTableExists();
  
    const sqlCheck = `
      SELECT id FROM jobs WHERE id = ?
    `;
  
    const [checkResults] = await connection.query(sqlCheck, [id]);
  
    if (checkResults.length === 0) {
      // The job does not exist in the database
      connection.close();
      throw new Error('Job not found 🤔');
    }
  
    const sqlDelete = `
      DELETE FROM jobs WHERE id = ?
    `;
  
    await connection.query(sqlDelete, [id]);
  
    connection.close();
  
    return true;
  }
  
  
}

module.exports = Job;
