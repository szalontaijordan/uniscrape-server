import { CronJob } from 'cron';
import { WatcherSubscriptionModel } from './models/watcher-subscription';
import { CommonBookItem } from './types/book/all.type';
import { WishlistItem, WishlistItemModel } from './models/wishlist-item';
import { DepositoryDOMService } from './services/depository/depository.dom.service';

import * as nodemailer from 'nodemailer';
import { config } from '../config/vars';
import { BookTransformerService } from './services/utils/book-transformer.service';
import { createUpdateEmail } from './update-email';

export class Watcher {

    private job: CronJob;
    private bookService: DepositoryDOMService;
    private bookTransformerService: BookTransformerService;

    private transporter: any;

    constructor(cronPattern: string = '0 */1 * * * *') {
        this.job = new CronJob(cronPattern, this.bookWatcherJob.bind(this));
        this.bookService = new DepositoryDOMService();
        this.bookTransformerService = new BookTransformerService();

        this.transporter = nodemailer.createTransport(config.email.gmail);
    }

    public async watchBooks(): Promise<void> {
        return this.job.start();
    }

    private async bookWatcherJob(): Promise<void> {
        console.log('Checking books!');
        const subscriptions = await WatcherSubscriptionModel.find({});
        const fullWishlist = await WishlistItemModel.find({});

        const checks: Array<Promise<Array<CommonBookItem>>> = [];
        for (const sub of subscriptions) {
            checks.push(this.getPriceDropBooks(fullWishlist, sub.userId));
        };
        const priceDropBooksPerSub = await Promise.all(checks);

        const notifications: Array<any> = [];
        const bookUpdates: Array<any> = [];

        for (let i = 0; i < subscriptions.length; i++) {
            if (priceDropBooksPerSub[i].length > 0) {
                console.log('Sending notfication and updating wishlist');
                notifications.push(this.notifyUser(subscriptions[i].email, priceDropBooksPerSub[i]));
                bookUpdates.push(this.updateUserWishlist(subscriptions[i].userId, priceDropBooksPerSub[i]));
            }
        }
        await Promise.all([...notifications, ...bookUpdates]);
    }

    private async getPriceDropBooks(fullWishlist: Array<WishlistItem>, userId: string): Promise<Array<CommonBookItem>> {
        const userWishlist = fullWishlist.find(item => item.userId === userId).bookList.books;
        const priceDropBooks: Array<CommonBookItem> = [];

        const checks = [];

        for (const book of userWishlist) {
            checks.push(this.bookService.getDepositoryBookByISBN(book.ISBN));
        }

        const onlineBooks = await Promise.all(checks);

        for (let i = 0; i < onlineBooks.length; i++) {
            const book = userWishlist[i];
            const onlineBook = onlineBooks[i];

            if (onlineBook.currentPrice < book.price) {
                priceDropBooks.push(this.bookTransformerService.transformDepositoryToCommon(onlineBook));
            }
        }

        return priceDropBooks;
    }

    private async notifyUser(email: string, books: Array<CommonBookItem>): Promise<void> {
        const mailOptions = {
            from: 'noreply@uniscrape.com',
            to: email,
            subject: '[uniscrape] - Könyvek frissültek ' + new Date().toLocaleString('hu-hu'),
            html: createUpdateEmail(books)
        }
        this.transporter.sendMail(mailOptions, (err: any, info: any) => {
            if (!err) {
                console.log(info);
            } else {
                console.log(err);
            }
        });
    }

    private async updateUserWishlist(userId: string, newBooks: Array<CommonBookItem>): Promise<void> {
        const wishlist = await WishlistItemModel.findOne({ userId });
        const updatedISBN = newBooks.map(book => book.ISBN);

        const oldBooks: Array<CommonBookItem> = wishlist.bookList.books.filter(oldBook => !updatedISBN.some(ISBN => oldBook.ISBN === ISBN));

        wishlist.bookList = { books: [...oldBooks, ...newBooks] };
        await wishlist.save();
    }
}
