import { Service, OnInit } from '@tsed/common';
import { WatcherSubscriptionModel } from '../../models/watcher-subscription';
import { SUBSCIPTION_NOT_FOUND_MESSAGE } from '../../types/exceptions/exceptions';

@Service()
export class WatcherService implements OnInit {
    
    constructor() {
    }
    
    public $onInit(): void {
    }

    public async getSubscription(userId: string): Promise<any> {
        const subscription = await WatcherSubscriptionModel.find({ userId });

        if (Array.from(subscription).length) {
            return subscription;
        }

        throw new Error(SUBSCIPTION_NOT_FOUND_MESSAGE);
    }

    public async subscribeToWatcher(userId: string, email: string): Promise<void> {
        const subscription = new WatcherSubscriptionModel({ userId, email });
        await subscription.save();
        return;
    }
    
    public async unsubscribeFromWatcher(userId: string, email: string): Promise<void> {
        await WatcherSubscriptionModel.deleteOne({ userId, email });
        return;
    }
}
