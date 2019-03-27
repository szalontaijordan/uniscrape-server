import { Service, OnInit } from '@tsed/common';
import { WatcherSubscriptionModel } from '../../models/watcher-subscription';
import { SUBSCIPTION_NOT_FOUND_MESSAGE } from '../../types/exceptions/exceptions';

/**
 * Utility service class for managing subscriptions to the watcher.
 * 
 * @author Szalontai Jordán
 */
@Service()
export class WatcherService implements OnInit {
    
    constructor() {
    }
    
    public $onInit(): void {
    }

    /**
     * Returns the user's subscription to the watcher based on their Google User Id.
     * 
     * @param userId the Google User Id of a user
     * 
     * @throws `Error` if the subscription was not found with the given Google User Id
     */
    public async getSubscription(userId: string): Promise<any> {
        const subscription = await WatcherSubscriptionModel.find({ userId });

        if (Array.from(subscription).length) {
            return subscription;
        }

        throw new Error(SUBSCIPTION_NOT_FOUND_MESSAGE);
    }

    /**
     * Creates a subscription to the watcher with the given Google User Id and the email.
     * 
     * @param userId the Google User Id of a user
     * @param email the email of the user that will be the target of the updates
     */
    public async subscribeToWatcher(userId: string, email: string): Promise<void> {
        const subscription = new WatcherSubscriptionModel({ userId, email });
        await subscription.save();
        return;
    }
    
    /**
     * Deletes a subscription from the watcher using the given Google User Id and the email.
     * 
     * @param userId the Google User Id of a user
     * @param email the email of the user that will no longer be the target of the updates
     */
    public async unsubscribeFromWatcher(userId: string, email: string): Promise<void> {
        await WatcherSubscriptionModel.deleteOne({ userId, email });
        return;
    }
}
