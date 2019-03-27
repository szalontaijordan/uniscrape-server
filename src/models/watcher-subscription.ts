import { prop, Typegoose } from 'typegoose';


/**
 * Entity class for subscriptions to the watcher.
 * 
 * @author Szalontai Jordán
 */
export class WatcherSubscription extends Typegoose {

    constructor() {
        super();
    }

    @prop({ required: true })
    userId: string;

    @prop({ required: true })
    email: string;
}

/**
 * Mongoose model for search history.
 * 
 * @see WatcherSubscription
 */
export const WatcherSubscriptionModel = new WatcherSubscription().getModelForClass(WatcherSubscription);
