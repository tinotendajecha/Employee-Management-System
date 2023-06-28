const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;

class Notification {
    constructor(id, notification, notificationPostedBy, notificationPostedTo, notificationPostedAt) {
        this.id = id;
        this.notification = notification;
        this.notificationPostedBy = notificationPostedBy;
        this.notificationPostedTo = notificationPostedTo;
        this.notificationPostedAt = notificationPostedAt;
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

    // checking if the notifications table exists
    static async ensureTableExists() {
        const connection = await this.getConnection();

        const [[result]] = await connection.query(`
      SELECT COUNT(*) as count FROM information_schema.tables
      WHERE table_schema = '${database}'
      AND table_name = 'notifications'
    `);

        const tableExists = result.count;

        if (tableExists === 0) {
            await connection.query(`
        CREATE TABLE notifications (
          id int NOT NULL AUTO_INCREMENT,
          notification text NOT NULL,
          notification_posted_by varchar(255) NOT NULL,
          notification_posted_to int NOT NULL,
          notification_posted_at datetime NOT NULL,
          FOREIGN KEY (notification_posted_to) REFERENCES users(id),
          PRIMARY KEY (id)
        )
      `);
        }

        connection.close();
    }
    // creating a new notification
    static async create(notification, notificationPostedBy, notificationPostedTo) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [results,] = await connection.query(`
      INSERT INTO notifications (notification, notification_posted_by, notification_posted_to, notification_posted_at)
      VALUES (?, ?, ?, NOW())
    `, [notification, notificationPostedBy, notificationPostedTo]);

        connection.close();

        return new Notification(results.insertId, notification, notificationPostedBy, notificationPostedTo, new Date());
    }

    // getting all notifications
    static async getAll() {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [rows] = await connection.query(`
      SELECT * FROM notifications ORDER BY notification_posted_at DESC
    `);

        connection.close();

        return rows.map(row => new Notification(row.id, row.notification, row.notification_posted_by, row.notification_posted_to, row.notification_posted_at));
    }

    // getting notifications by date range
    static async getByDateRange(startDate, endDate) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [rows] = await connection.query(`
      SELECT * FROM notifications WHERE notification_posted_at >= ? AND notification_posted_at <= ? ORDER BY notification_posted_at DESC
    `, [startDate, endDate]);

        connection.close();

        return rows.map(row => new Notification(row.id, row.notification, row.notification_posted_by, row.notification_posted_to, row.notification_posted_at));
    }

    // deleting a notification by ID
    static async deleteById(id) {
        await this.ensureTableExists();

        const connection = await this.getConnection();

        const [results,] = await connection.query(`
      DELETE FROM notifications WHERE id = ?
    `, [id]);

        connection.close();

        return results.affectedRows === 1;
    }
}

module.exports = Notification;