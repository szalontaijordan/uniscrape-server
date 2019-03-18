import { Service, OnInit } from '@tsed/common';
import { WatcherSubscriptionModel } from '../../models/watcher-subscription';

@Service()
export class WatcherService implements OnInit {
    
    constructor() {
    }
    
    public $onInit(): void {
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
