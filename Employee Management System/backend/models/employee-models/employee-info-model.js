const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class EmployeeInfo {
    constructor(id, email, address, dob, nextOfKin,nextOfKinPhoneNumber, maritalStatus, accountNumber, healthInfo, criminalRecord, citizenship, gender, race) {
        this.id = id,
            this.email = email,
            this.address = address,
            this.dob = dob,
            this.next_of_kin = next_of_kin,
            this.nextOfKinPhoneNumber = nextOfKinPhoneNumber,
            this.maritalStatus = maritalStatus,
            this.accountNumber = accountNumber,
            this.healthInfo = healthInfo,
            this.criminalRecord = criminalRecord,
            this.citizenship = citizenship,
            this.gender = gender,
            this.race = race
    }

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
      AND table_name = 'employee_details'
    `);

        const tableExists = result.count;
        
        if (tableExists === 0) {
            await connection.query(`
      CREATE TABLE employee_details (
        id INT NOT NULL AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        address VARCHAR(255),
        dob DATE,
        next_of_kin VARCHAR(255),
        next_of_kin_phone_number VARCHAR(255),
        marital_status VARCHAR(20),
        account_number VARCHAR(20),
        health_info TEXT,
        criminal_record TEXT,
        citizenship VARCHAR(50),
        gender VARCHAR(10),
        race VARCHAR(50),
        PRIMARY KEY (id),
        FOREIGN KEY (email) REFERENCES employees(email)
      );
      `);
        }

        connection.close();
    }

    // Function to insert data into the table
    static async create(email, address, dob, next_of_kin,nextOfKinPhoneNumber, maritalStatus, accountNumber, healthInfo, criminalRecord, citizenship, gender, race) {
        const connection = await EmployeeInfo.getConnection();

        await EmployeeInfo.ensureTableExists();

        const sql = `
        INSERT INTO employee_details (email, address, dob, next_of_kin, next_of_kin_phone_number, marital_status, account_number, health_info, criminal_record, citizenship, gender, race)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await connection.query(sql, [email, address, dob, next_of_kin,nextOfKinPhoneNumber, maritalStatus, accountNumber, healthInfo, criminalRecord, citizenship, gender, race]);

        const insertedRowId = result.insertId;

        const selectSql = `
      SELECT * FROM employee_details WHERE id = ?
    `;

        const [selectedRow] = await connection.query(selectSql, [insertedRowId]);

        connection.close();

        return selectedRow[0];
    }

    // Function to retrieve data from the table
    static async findByEmail(email) {
        const connection = await EmployeeInfo.getConnection();

        await EmployeeInfo.ensureTableExists();

        const sql = `
      SELECT * FROM employee_details WHERE email = ?
    `

        const [results] = await connection.query(sql, [email]);

        connection.close();

        if(results.length > 0){
            return results[0]
        }else{
            return null
        }
        
    }
}

module.exports = EmployeeInfo;