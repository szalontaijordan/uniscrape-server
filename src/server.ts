import * as Path from 'path';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

import { Watcher } from './watcher';

import { ServerLoader, ServerSettings } from '@tsed/common';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { config } from '../config/vars';

@ServerSettings({
    rootDir: Path.resolve(__dirname),
    acceptMimes: ['application/json'],
    mount: {
        '/api': `${Path.resolve(__dirname)}/controllers/**/*.js`
    },
    port: process.env.PORT || 8080,
    httpsPort: process.env.PORT || 8000,
})
export class Server extends ServerLoader {

    private bookWatcher: Watcher;
    private db: mongoose.Connection;

    public $onMountingMiddlewares(): void {
        this.use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }))
            .use(express.static(Path.join(__dirname, '..', '/public')))
            .use('/doc', express.static(Path.join(__dirname, '..', '/docs')))
            .use(this.CORS())
            .use(this.defaultIndexHTML());
    }

    public $afterRoutesInit(): void {
        this.use(ErrorHandlerMiddleware);
        this.connectDB();
        this.bookWatcher = new Watcher(process.env.WATCHER_CRON_JOB);
    }

    public $onReady(): void {
        console.log('Server started...');
        Promise.resolve()
            .then(() => this.bookWatcher.watchBooks())
            .then(() => console.log('Started watching books on wishlists'));
    }

    public $onServerInitError(err: any): void {
        console.error(err);
    }

    private connectDB(): void {
        mongoose.connect(config.db.testURI);
        
        this.db = mongoose.connection;
        this.db.on('error', err => { throw err; });
        this.db.once('open', () => console.log('MongoDB connected to test URI'));
    }

    private CORS(): Function {
        return (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
        
            if (req.method === 'OPTIONS') {
                res.sendStatus(200);
            } else {
                next();
            }
        };
    }

    private defaultIndexHTML(): Function {
        return (req, res, next) => {
            if (req.originalUrl === '/doc') {
                res.sendFile(Path.join(__dirname, '..', '/docs/index.html'));
            } else if (!(req.originalUrl.indexOf('/api') === 0)) {
                res.sendFile(Path.join(__dirname, '..', '/public/index.html'));
            } else {
                next();
            }
        };
    }
}
