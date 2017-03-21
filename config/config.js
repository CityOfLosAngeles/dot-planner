module.exports = {
    "development": {
        "username": "postgres",
        "password": "password",
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
