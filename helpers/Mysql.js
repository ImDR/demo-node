const { required } = require("joi");

const mysql = require('mysql');

function Mysql() {
    this.pool = mysql.createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        debug: true
    });
};

Mysql.prototype.query = function (options) {
    return new Promise((resolve, reject) => {
        this.pool.getConnection(function (error, connection) {
            if (error) return reject(error);

            // Use the connection
            connection.query(options, function (error, results, fields) {
                // When done with the connection, release it.
                connection.release();

                // Handle error after the release.
                if (error) return reject(error);

                resolve(results);
            });
        });
    });
};

module.exports = Mysql;