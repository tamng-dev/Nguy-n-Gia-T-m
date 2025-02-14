import { NextFunction, Router } from 'express';
import logger from '../library/log/logger.log.js';
import lib from '../library/helper/general.helper.js';
import { Req, Res, ResFail, RequestHandlerCustom, NextFunc } from '../library/interface-type/general.itf.js'

function handle_error(error: any, req: Req, res: Res, next: NextFunction) {
    const level = error.level || 'error'
    const code = error.error_code || lib.ERROR_CODE.SERVER_ERROR;
    const status = error.status || 200;
    const error_msg = error.msg_return || "Có lỗi xảy ra. Vui lòng thử lại sau"
    const debug_msg = error.message || null
    const data_return = { error_code: code, error_msg, debug_msg, data: error.data || null }
    if (level === 'error') {
        logger(error.message, error, level)
    }

    if (!res.is_send_data) {
        res.is_send_data = true
        res.status(status).json(data_return)
    }
}

function safety(callback: RequestHandlerCustom): RequestHandlerCustom {
    if (callback.constructor.name === 'AsyncFunction') {
        return async function (req: Req, res: Res, next: NextFunc) {
            res.success = function (data = {}, error_code = lib.ERROR_CODE.SUCCESS, status = 200) {
                this.is_send_data = true
                this.status(status).json({ error_code: error_code, data: data, debug_msg: null })
            }
            res.fail = fail
            try {
                function nextS(val: any) {
                    val ? next(val) : next()
                }
                await callback(req, res, nextS)
            } catch (err) {
                handle_error(err, req, res, next)
            }
        }
    } else {
        return async function (req: Req, res: Res, next: NextFunc) {
            res.success = function (data = {}, status = 200) {
                this.is_send_data = true
                this.status(status).json({ error_code: lib.ERROR_CODE.SUCCESS, data, debug_msg: null })
            }
            res.fail = fail
            try {
                function nextS(val: any) {
                    val ? next(val) : next()
                }
                await callback(req, res, nextS)
            } catch (err) {
                handle_error(err, req, res, next)
            }
        }
    }
}

interface RouterCustom extends Router {
    useS: (path: string, ...callbackList: RequestHandlerCustom[]) => void,
    getS: (path: string, ...callbackList: RequestHandlerCustom[]) => void,
    postS: (path: string, ...callbackList: RequestHandlerCustom[]) => void,
}

function my_router(...args: any): RouterCustom {
    const router: any = Router();
    router.useS = function (path: string, ...callbackList: RequestHandlerCustom[]) {
        if (typeof path === 'function') {
            callbackList = [path, ...callbackList];
        }
        const callback_safety_list: Array<any> = []
        for (const callback of callbackList) {
            callback_safety_list.push(safety(callback))
        }
        if (typeof path === 'function') {
            router.use(...callback_safety_list)
        } else if (typeof path === 'string') {
            router.use(path, ...callback_safety_list)
        } else {
            throw new Error("Path incorrect format")
        }
    }

    router.getS = function (path: string, ...callbackList: RequestHandlerCustom[]) {
        const callback_safety_list: Array<any> = []
        for (const callback of callbackList) {
            callback_safety_list.push(safety(callback))
        }
        router.get(path, ...callback_safety_list)
    }

    router.postS = function (path: string, ...callbackList: RequestHandlerCustom[]) {
        const callback_safety_list: Array<any> = []
        for (const callback of callbackList) {
            callback_safety_list.push(safety(callback))
        }
        router.post(path, ...callback_safety_list)
    }
    return router
}

const fail: ResFail = (message = '', error_code?: number | null, data = null, status?: number | null, callback?: Function) => {
    const error: any = {};
    error.level = 'info'
    error.message = ""
    error.msg_return = message
    error.error_code = error_code ?? lib.ERROR_CODE.INPUT_FAIL
    error.status = status ?? 200
    error.data = data
    if (callback) {
        if (callback?.constructor?.name === "AsyncFunction") {
            callback().then((val: any) => { }).catch((err: any) => console.error(err))
        } else {
            try {
                callback()
            } catch (error) {
                console.error(error)
            }
        }
    }
    throw error
}

export default my_router
