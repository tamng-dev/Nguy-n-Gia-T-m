//@ts-ignore

import { Options, Sequelize } from "sequelize";
import config from '../../config/setting.js'
import { Company } from "./sequelize-models/company.model.js";

type Modes = {
    Company: typeof Company,
}

class Database {
    private static instance: Database;
    private readonly _sequelize: Sequelize;
    private readonly models_db: Modes;
    private constructor() {
        this._sequelize = new Sequelize(
            config.sequelize.database,
            config.sequelize.username,
            config.sequelize.password,
            {
                // logging: false,
                logging(sql, timing) {
                    console.log(sql);
                    console.log("Query time:", timing, "ms");    
                },
                benchmark: true,
                ...config.sequelize.options
            } as Options
        )
        this.models_db = {
            Company: Company.initModel(this._sequelize)
        }
        // this.createAssocitions();
        this._sequelize.authenticate().then(() => console.log("CONNECTED DATABASE!")).catch((err: any) => console.error(err))
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Database()
        };
        return this.instance
    }

    get models() {
        return this.models_db
    }

    get sequelize() {
        return this._sequelize
    }

    // private createAssocitions() {
        
    // }
}

const db_instance = Database.getInstance()

export const models = db_instance.models
export const db = db_instance.sequelize

