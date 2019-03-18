import { prop, Typegoose } from 'typegoose';

export class WatcherSubscription extends Typegoose {

    constructor() {
        super();
    }

    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    email: string;
}

export const WatcherSubscriptionModel = new WatcherSubscription().getModelForClass(WatcherSubscription);
