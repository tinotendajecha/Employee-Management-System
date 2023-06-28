const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class LeaveBalances {
    constructor(id, sickLeaveDays, holidayLeaveDays, employeeId) {
        this.id = id;
        this.sickLeaveDays = sickLeaveDays;
        this.holidayLeaveDays = holidayLeaveDays;
        this.employeeId = employeeId;
    }

    // database connection
    static async getConnection() {
        const connection = await mysql.createConnection({
            host,
            user,
            database,
        });

        return connection;
    }

    // checking if the leave_requests table exists
    static async ensureTableExists() {
        const connection = await this.getConnection();

        const [[result]] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables
      WHERE table_schema = '${database}'
      AND table_name = 'leave_balances'
    `);

        const tableExists = result.count;

        if (tableExists === 0) {
            await connection.query(`
            CREATE TABLE leave_balances (
                id INT NOT NULL AUTO_INCREMENT,
                employee_id INT NOT NULL,
                sick_leave_days INT NOT NULL,
                holiday_leave_days INT NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (employee_id) REFERENCES employees(id)
              );
      `);
        }

        connection.close();
    }

    static async getEmployeesLeaveInformation(id){
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const sql = `
        SELECT employees.first_name, leave_balances.sick_leave_days, leave_balances.holiday_leave_days
        FROM leave_balances
        JOIN employees ON leave_balances.employee_id = employees.id
        WHERE employees.id = ?;
        `

        const [result] = await connection.query(sql, [id]);

        connection.close();
        
        return result;
    }

    static async createLeaveBalance(employeeId, sickLeaveDays, holidayLeaveDays) {
        await this.ensureTableExists();
      
        const connection = await this.getConnection();
      
        const sql = `
          INSERT INTO leave_balances (employee_id, sick_leave_days, holiday_leave_days)
          VALUES (?, ?, ?);
        `;
      
        const [result] = await connection.query(sql, [employeeId, sickLeaveDays, holidayLeaveDays]);
      
        return result.insertId;
      }
}

module.exports = LeaveBalances;