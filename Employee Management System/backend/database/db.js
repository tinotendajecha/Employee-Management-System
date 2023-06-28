const mysql = require('mysql2');
require('dotenv').config();

const host = process.env.HOST;
const user = process.env.USER;
const database = process.env.DATABASE;




const connectDb = () => {
    
    const connection = mysql.createConnection({
        host,
        user,
    });

    // create the database if it doesn't exist
    connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`, (err, result) => {
        if (err) {
        console.error('Error creating database:', err);
        return;
        }

        console.log('Database created or already exists');

        // close the connection
        connection.end();
    });

    //connection pool to the database
    const pool = mysql.createPool({
        host,
        user,
        database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    // testing the database connection
    pool.getConnection((err, connection) => {
        if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
        }

        console.log('Succesfully connected to MySQL database!');

        // release the connection
        connection.release();
    });

    return pool;
}

module.exports = connectDb;
