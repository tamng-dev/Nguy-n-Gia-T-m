import chalk from 'chalk';
import logger from '../library/log/logger.log.js';
import lib from '../library/helper/general.helper.js';
import { NextFunc } from '../library/interface-type/general.itf.js';
import { RequestHandler, Request, Response } from 'express';

export const write_log_request: RequestHandler = async (req: Request, res: Response, next: NextFunc) => {
    logger(`${req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress} - ${req.method} ${chalk.cyan(req.originalUrl || "")} ${req.headers['user-agent']}`, {}, 'info', 'yellow')
    if (req.method === 'POST') {
        let body = '{}'
        try {
            body = JSON.stringify(req.body)
        } catch (error) {
            lib.print.red(JSON.stringify(error))
        }
        logger(`POST BODY: ${chalk.greenBright(body)}`, {}, 'info')
    }
    next()
}

export const wrile_log_response: RequestHandler = async (req: Request, res: Response, next: NextFunc) => {
    const chucks: Array<any> = []
    const old_write = res.send;
    res.send = function (chuck: any) {
        chucks.push(Buffer.from(chuck))
        return old_write.call(res, chuck)
    }
    res.on("finish", () => {
        logger(`${chalk.white("RETURN:")} ${Buffer.concat(chucks).toString('utf8')}`, {}, 'info', 'blueBright');
    })
    next()
}

export default {
    write_log_request,
    wrile_log_response
}