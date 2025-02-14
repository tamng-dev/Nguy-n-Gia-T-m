import winston from 'winston';
import chalk, { ColorName } from 'chalk';
import DailyRotateFile from 'winston-daily-rotate-file';
import { _dirname } from '../helper/general.helper.js';

const logger_ws = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.errors({ stack: true, code: true, errno: true }),
        winston.format.timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }),
        winston.format.printf((info: any) => {
            info.level = info.level.replace(/info/, 'INFO')
            info.level = info.level.replace(/error/, 'ERROR')
            info.level = info.level.replace(/warn/, 'WARN')
            info.level = info.level.replace(/debug/, 'DEBUG')
            let color_level: ColorName = 'white'
            if (/info/i.test(info.level)) {
                color_level = 'cyan'
            } else if (/ERROR/i.test(info.level)) {
                color_level = 'red'
            } else if (/warn/i.test(info.level)) {
                color_level = 'yellow'
            }

            if (info.stack) {
                return `${chalk.blue(info.timestamp)} | [${chalk[color_level](info.level)}] : ${chalk.red(info.message)}\n ${chalk.red(info.stack)}`
            }
            return `${chalk.blue(info.timestamp)} | [${chalk[color_level](info.level)}] : ${info.message}`
        }),
    ),
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            dirname: `${_dirname(import.meta.url)}/../../logs/Info`,
            filename: `%DATE%.log`,
            datePattern: "DD-MM-YYYY",
            json: false,
            level: 'info',
            maxFiles: '7d'
        }) as winston.transport,
        new DailyRotateFile({
            dirname: `${_dirname(import.meta.url)}/../../logs/Warn`,
            filename: `%DATE%.log`,
            datePattern: "DD-MM-YYYY",
            json: false,
            level: 'warn',
            maxFiles: '7d'
        }),
        new DailyRotateFile({
            dirname: `${_dirname(import.meta.url)}/../../logs/Debug`,
            filename: `%DATE%.log`,
            datePattern: "DD-MM-YYYY",
            json: false,
            level: 'debug',
            maxFiles: '7d'
        }),
        new DailyRotateFile({
            dirname: `${_dirname(import.meta.url)}/../../logs/Error`,
            filename: `%DATE%.log`,
            datePattern: "DD-MM-YYYY",
            json: false,
            level: 'error',
            maxFiles: '7d'
        }),
        new DailyRotateFile({
            dirname: `${_dirname(import.meta.url)}/../../logs/default`,
            filename: `%DATE%.log`,
            datePattern: "DD-MM-YYYY",
            json: false,
            maxFiles: '7d'
        })
    ],
    exitOnError: false
})

export function logger(message: string, error = {}, level = "debug", color?: ColorName) {
    if (color && chalk[color]) {
        message = chalk[color](message)
    }
    switch (level) {
        case "debug":
            logger_ws.debug(message, error)
            break;
        case "error":
            logger_ws.error(message, error)
            break;
        case "warn":
            logger_ws.warn(message, error)
            break;
        case "info":
            logger_ws.info(message, error)
            break;
        default:
            logger_ws.info(message, error)
            break;
    }

}

export default logger