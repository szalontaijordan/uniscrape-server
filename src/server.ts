import * as Path from 'path';
import * as bodyParser from 'body-parser';

import { ServerLoader, ServerSettings } from '@tsed/common';

@ServerSettings({
    rootDir: Path.resolve(__dirname),
    acceptMimes: ['application/json'],
    mount: {
        '/api': `${Path.resolve(__dirname)}/controllers/*.js`
    }
})
export class Server extends ServerLoader {

    public $onMountingMiddlewares(): void | Promise<any> {
        this.use(bodyParser.json())
            .use(bodyParser.urlencoded({ extended: true }));
    }

    public $onReady() {
        console.log('Server started...');
    }

    public $onServerInitError(err) {
        console.error(err);
    }
}
