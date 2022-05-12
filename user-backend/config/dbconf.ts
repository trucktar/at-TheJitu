const dbConf = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: <string>process.env.DB_HOST,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};

export default dbConf;
