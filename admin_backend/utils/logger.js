import winston from "winston";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5
};

const level = () => {
    const env = process.env.NODE_ENV || 'development'
    const isDevelopment = env === 'development'
    return isDevelopment ? 'debug' : 'warn'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    verbose: 'cyan',
    debug: 'white'
};
winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)

const transports = [
    // Allow the console to print messages
    new winston.transports.Console(),
    // Print all the error messages inside the error.log file
    new winston.transports.File({
        filename: 'logs/admin-error.log',
        level: 'error',
    }),
    new winston.transports.File({
        filename: 'logs/admin-warn.log',
        level: 'warn',
    }),
    new winston.transports.File({
        filename: 'logs/admin-info.log',
        level: 'info',
    }),
    new winston.transports.File({
        filename: 'logs/admin-http.log',
        level: 'http',
    }),
    new winston.transports.File({
        filename: 'logs/admin-verbose.log',
        level: 'verbose',
    }),
    new winston.transports.File({
        filename: 'logs/admin-debug.log',
        level: 'debug',
    }),
    // Print all the error message inside the all.log file
    new winston.transports.File({ filename: 'logs/admin-all.log' }),
]

const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

export default logger