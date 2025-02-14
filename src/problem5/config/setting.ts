const db = {
    type: process.env.DB_TYPE ?? "mysql",
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: process.env.DB_PORT ?? 3306,
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "root",
    database: process.env.DB_DATABASE ?? "workspace"
}

export default {
    server: {
        PORT: process.env.SERVER_PORT ?? 3000
    },
    sequelize: {
        database: db.database,
        username: db.user,
        password: db.password,
        options: {
            host: db.host,
            port: db.port,
            dialect: db.type,
            dialectOptions: {
                decimalNumbers: true
            },
            timezone: "+07:00",
            pool: {
                max: 200,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
        }
    }
};
