import express, { Express } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from './config/setting.js';
import handle_request from './src/middleware/handle_request.js'
import http from 'http';
import fs from 'fs';
import { _dirname } from './src/library/helper/general.helper.js';
import os from 'os';
import compression from 'compression';


const app: Express = express();
export const server: http.Server = new http.Server(app)

app.set('trust proxy', true);

//Parse body request
app.use(bodyParser.json({ limit: "150mb" }));

//CORS
app.use(cors({
    origin: "*",
    methods: "GET,POST",
    allowedHeaders: "*",
    preflightContinue: false,
    optionsSuccessStatus: 204
}))

//Write log request and response
app.use(handle_request.write_log_request)
app.use(handle_request.wrile_log_response)

//Compression gzip
app.use(compression())

server.listen(config.server.PORT, () => {
    console.log("Server in running: ", config.server.PORT);
});

//Auto load router from router folder and .router.js file extension
const routers = fs.readdirSync(`${_dirname(import.meta.url)}/src/router`, 'utf8').map(val => val.toLowerCase()).filter(val => /^.*\.router\.js$/.test(val))
routers.forEach(val => {
    const api = `/api/v1/${val.split('.').shift()}`
    const prefix_path = /window/i.test(os.type()) ? "file:/" : ""
    import(`${prefix_path}${_dirname(import.meta.url)}/src/router/${val}`)
        .then((module) => {
            console.log("AUTO LOAD ROUTER:", api);
            app.use(api, module.default)
        })
        .catch(err => {
            console.log("LOAD ROUTER ERROR: ", err);
        })
});

