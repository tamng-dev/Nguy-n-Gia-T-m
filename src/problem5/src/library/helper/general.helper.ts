import chalk from 'chalk';
import { fileURLToPath } from 'url';
import path from 'path';

const { dirname } = path

export const ERROR_CODE = {
    SUCCESS: 0,
    INPUT_FAIL: 1001,
    SERVER_ERROR: 9999
}

export const PATTERN = {
    NUMBER: /^-?\d+$/,
    POSITIVE_INTEGER: /^(0|[1-9]\d*)$/,
    FLOAT: /^-?(0|0.\d*[1-9]|[1-9]\d*(\.\d+|\d*))$/,
    STRING: /^(?!undefined)(?!null)(?=.*\S).*/,
    VARCHAR: /^(?!undefined)(?!null)(?=.*\S).{1,255}$/
}

export const str = <T>(value: T): string => {
    const result = typeof value === 'string' || typeof value === "number" ? `${value}`.trim() : ""
    return result
}

export const num = <T>(value: T): number | undefined => {
    if (!PATTERN.NUMBER.test(str(value))) {
        return undefined
    }
    const val_convert = +value
    const result = Number.isFinite(val_convert) ? val_convert : undefined
    return result
}

export const _dirname = (data: string): string => {
    const __filename = fileURLToPath(data);
    return dirname(__filename);
}

export const check_values = (valuelist: boolean[] = [], errNameList: string[] = [], errCode: number[] = [], data: any = null, callback?: Function) => {
    const error: { [key: string]: any } = new Error()
    loop:
    for (let i = 0; i < valuelist.length; i++) {
        switch (true) {
            case !valuelist[i]:
                error.msg_return = errNameList[i] || "Giá trị không hợp lệ. Vui lòng thử lại"
                error.error_code = errCode[i] || 1
                error.level = 'info'
                error.data = data
                break loop;
            default:
                break;
        }
    }
    if (error.msg_return) {
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
}

export const print = {
    white: function (...message: Array<any>) {
        console.log(...message);
    },
    red: function (...message: Array<any>) {
        console.log(chalk.red(...message));
    },
    blue: function (...message: Array<any>) {
        console.log(chalk.blue(...message));
    },
    yellow: function (...message: Array<any>) {
        console.log(chalk.yellow(...message));
    },
    cyan: function (...message: Array<any>) {
        console.log(chalk.cyan(...message));
    },
    white_bg: function (...message: Array<any>) {
        console.log(chalk.bgWhite(...message));
    },
    red_bg: function (...message: Array<any>) {
        console.log(chalk.bgRed(...message));
    },
    blue_bg: function (...message: Array<any>) {
        console.log(chalk.bgBlue(...message));
    },
    yellow_bg: function (...message: Array<any>) {
        console.log(chalk.bgYellow(...message));
    },
    cyan_bg: function (...message: Array<any>) {
        console.log(chalk.bgCyan(...message));
    }
}


export default {
    ERROR_CODE,
    PATTERN,
    print,
    check_values
}