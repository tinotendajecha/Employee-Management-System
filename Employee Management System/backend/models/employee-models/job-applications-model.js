//This model will be used by both the employee and the admin
//The admin will be able to get all the job applications and review the application [PATCH]
//The employee will be able to post their job-application to the applications table

const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class Application {
  constructor(id, firstName, lastName, email, phoneNumber, jobId, status, appliedAt, reviewedAt) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phoneNumber = phoneNumber;
    this.jobId = jobId;
    this.status = status;
    this.appliedAt = appliedAt;
    this.reviewedAt = reviewedAt;
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
      AND table_name = 'applications'
    `);

    const tableExists = result.count;

    if (tableExists === 0) {
      await connection.query(`
      CREATE TABLE applications (
        id int NOT NULL AUTO_INCREMENT,
        first_name varchar(255) NOT NULL,
        last_name varchar(255) NOT NULL,
        email varchar(255) NOT NULL UNIQUE,
        phoneNumber varchar(20) NOT NULL,
        job_id int NOT NULL,
        status enum('accepted', 'rejected', 'pending') NOT NULL,
        applied_at datetime DEFAULT CURRENT_TIMESTAMP,
        reviewed_at datetime,
        PRIMARY KEY (id),
        FOREIGN KEY (job_id) REFERENCES jobs(id),
        FOREIGN KEY (email) REFERENCES users(email)
      );
      
      `);
    }

    connection.close();
  }

  static async create(firstName, lastName, email, phoneNumber, jobId, status, appliedAt, reviewedAt) {
    const connection = await Application.getConnection();
  
    await Application.ensureTableExists();
  
    const sql = `
      INSERT INTO applications (first_name, last_name, email, phoneNumber, job_id, status, applied_at, reviewed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const [results] = await connection.query(sql, [firstName, lastName, email, phoneNumber, jobId, status, appliedAt, reviewedAt]);
  
    const insertedRowId = results.insertId;
  
    const selectSql = `
      SELECT * FROM applications WHERE id = ?
    `;
  
    const [rows] = await connection.query(selectSql, [insertedRowId]);
  
    connection.close();
  
    return rows[0];
  }

  static async findById(id) {
    const connection = await Application.getConnection();

    await Application.ensureTableExists();

    const sql = `
      SELECT * FROM applications WHERE id = ?
    `;

    const [results] = await connection.query(sql, [id]);

    connection.close();

    return results[0];
  }

  // this fn was removed
  static async findByUserId(id) {
    const connection = await Application.getConnection();
  
    await Application.ensureTableExists();
  
    const sql = `
      SELECT * FROM applications WHERE user_id = ?
    `;
  
    const [results] = await connection.query(sql, [id]);
  
    connection.close();
  
    if (results.length === 0) {
      return 0;
    }
  
    return results;
  }

  // function for checking if the user already exists in the applications table  [A user should only have one application]
  static async findByEmail(email){
    const connection = await Application.getConnection();
  
    await Application.ensureTableExists();

    const sql = `
      SELECT * FROM applications WHERE email = ?
    `;

    const [results] = await connection.query(sql, [email]);
  
    connection.close();

    if (results.length === 0) {
      return 0;
    }

    return results;
  }

  static async findAllPending() {
    const connection = await Application.getConnection();

    await Application.ensureTableExists();

    const sql = `
      SELECT * FROM applications WHERE status = 'pending'
    `;

    const [results] = await connection.query(sql);

    connection.close();

    return results;
  }

  static async changeApplicationStatusToAccepted(id){
    // accepted
    const connection = await Application.getConnection();

    await Application.ensureTableExists();

    const sql = `
      UPDATE applications SET status = 'accepted' WHERE id = ?;
    `
    await connection.query(sql, [id]);

    return true;
  }

  static async changeApplicationStatusToRejected(id){
    // rejected
    const connection = await Application.getConnection();

    await Application.ensureTableExists();

    const sql = `
      UPDATE applications SET status = 'rejected' WHERE id = ?;
    `
    await connection.query(sql, [id]);

    return true;
  }


  static async deleteById(id) {
    const connection = await Application.getConnection();
  
    await Application.ensureTableExists();

    const sql = `
      DELETE FROM applications WHERE id = ?
    `
    
    await connection.query(sql, [id]);
  
    connection.close();
  
    return true;
  }
}

module.exports = Application;
