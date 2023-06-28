const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class LeaveRequest {
    constructor(id, employeeId, startDate, endDate, status, reasonForLeave) {
        this.id = id;
        this.employeeId = employeeId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.reasonForLeave = reasonForLeave;
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
      AND table_name = 'leave_requests'
    `);

        const tableExists = result.count;

        if (tableExists === 0) {
            await connection.query(`
            CREATE TABLE leave_requests (
                id int NOT NULL AUTO_INCREMENT,
                employee_id int NOT NULL,
                start_date varchar(255) NOT NULL,
                end_date varchar(255) NOT NULL,
                status varchar(50) NOT NULL,
                reason_for_leave varchar(255) NOT NULL,
                PRIMARY KEY (id),
                FOREIGN KEY (employee_id) REFERENCES employees(id)
                );
      `);
        }

        connection.close();
    }

    // creating a new leave request
    static async create(employeeId, startDate, endDate, reasonForLeave) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [results] = await connection.query(`
      INSERT INTO leave_requests (employee_id, start_date, end_date, reason_for_leave, status)
      VALUES (?, ?, ?, ?, 'pending')
    `, [employeeId, startDate, endDate, reasonForLeave]);

        connection.close();

        return new LeaveRequest(results.insertId, employeeId, startDate, endDate, 'pending', reasonForLeave);
    }

    // getting all leave requests
    static async getAll() {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [rows] = await connection.query(`
      SELECT * FROM leave_requests
    `);

        connection.close();

        return rows.map(row => new LeaveRequest(row.id, row.employee_id, row.start_date, row.end_date, row.status, row.reason_for_leave));
    }

    // getting leave requests by employee ID
    static async getByEmployeeId(employeeId) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [rows] = await connection.query(`
      SELECT * FROM leave_requests WHERE employee_id = ?
    `, [employeeId]);

        connection.close();

        return rows.map(row => new LeaveRequest(row.id, row.employee_id, row.start_date, row.end_date, row.status));
    }

    // getting leave requests by status
    static async getByStatus(status) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [rows] = await connection.query(`
      SELECT * FROM leave_requests WHERE status = ?
    `, [status]);

        connection.close();

        return rows.map(row => new LeaveRequest(row.id, row.employee_id, row.start_date, row.end_date, row.status));
    }

    // getting leave requests by date range
    static async getByDateRange(startDate, endDate) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [rows] = await connection.query(`
      SELECT * FROM leave_requests WHERE start_date >= ? AND end_date <= ?
    `, [startDate, endDate]);

        connection.close();

        return rows.map(row => new LeaveRequest(row.id, row.employee_id, row.start_date, row.end_date, row.status));
    }



    // updating a leave request by ID
    static async updateById(id, status) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [results,] = await connection.query(`
      UPDATE leave_requests SET status = ? WHERE id = ?
    `, [status, id]);

        connection.close();

        return results.changedRows === 1;
    }

    // deleting a leave request by ID
    static async deleteById(id) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [results,] = await connection.query(`
      DELETE FROM leave_requests WHERE id = ?
    `, [id]);

        connection.close();

        return results.affectedRows === 1;
    }
}

module.exports = LeaveRequest;