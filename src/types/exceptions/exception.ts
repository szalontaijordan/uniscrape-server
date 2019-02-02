export class CustomException {

    constructor(...args: Array<any>) {
        Error.apply(this, ...args);
    }
}
