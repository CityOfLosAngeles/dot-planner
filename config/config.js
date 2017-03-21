module.exports = {
    "development": {
        "username": "postgres",
<<<<<<< HEAD
        "password": "p0st4ge",
=======
        "password": "password",
>>>>>>> bb2dd2f1b54f6c4281e19f8a7967e57cbbcbdd74
        "database": "postgres",
        "host": "127.0.0.1",
        "dialect": "postgres",
        "protocol": "postgres",
        "port": "5432"
    },
    "test": {
        "username": "postgres",
        "password": "password",
        "database": "dot",
        "host": "127.0.0.1",
        "dialect": "postgres",
        "protocol": "postgres",
        "port": "5432"
    },
    "production": {
        "host": process.env.RDS_HOSTNAME,
        "username": process.env.RDS_USERNAME,
        "password": process.env.RDS_PASSWORD,
        "port": process.env.RDS_PORT,
        "database": process.env.RDS_DBNAME,
        "dialect": "postgres",
        "protocol": "postgres"
    }
}
