import * as Path from 'path';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { ServerLoader, ServerSettings } from '@tsed/common';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';

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

    public $onMountingMiddlewares(): void {
        this.use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }))
            .use((req, res, next) => {
                res.header('Access-Control-Allow-Origin', '*');
                res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
                res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
            
                if (req.method === 'OPTIONS') {
                    res.sendStatus(200);
                } else {
                    next();
                }
            })
            .use(express.static(Path.join(__dirname, '..', '/public')))
            .use((req, res, next) => {
                if (!(req.originalUrl.indexOf('/api') === 0)) {
                    res.sendfile(Path.join(__dirname, '..', '/public/index.html'));
                } else {
                    next();
                }
            });
    }

    public $afterRoutesInit(): void {
        this.use(ErrorHandlerMiddleware);
    }

    public $onReady(): void {
        console.log('Server started...');
    }

    public $onServerInitError(err: any): void {
        console.error(err);
    }
}
