import { Request, Response, NextFunction, RequestHandler } from 'express';
import { INotificationsDocument } from '../../database/mongo-models/notifications.model.js';
import { FIELD_TYPE, IS_FILTER, USER_STATUS } from '../enum/general.enum.js';

export interface Req extends Request {
    user_info?: {
        account_type?: number,
        company_id?: number,
        role_id?: number
        range_role?: number,
        role_parent?: number,
        status?: USER_STATUS
    },
    employee?: Array<number>,
    user_query?: Array<number>,
    [key: string]: any
}

export interface Res extends Response {
    success: ResSuccess;
    fail: ResFail;
    [key: string]: any
}

export interface NextFunc extends NextFunction { }

export type RequestHandlerCustom = (req: Req, res: Res, next: NextFunc) => Promise<void> | void

export interface Err extends Error {
    [key: string]: any
}

export interface ObjectCustom {
    [key: string | number]: any
}
export type ResSuccess = (data: any, error_code?: number, status?: number) => any;

export type ResFail = (message: string, error_code?: number | null, data?: any | null, status?: number | null, callback?: Function) => any;


