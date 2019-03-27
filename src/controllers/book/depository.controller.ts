import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore, PathParams } from '@tsed/common';
import { InternalServerError, NotFound, Unauthorized, BadRequest } from 'ts-httpexceptions';

import { DepositoryDOMService } from '../../services/depository/depository.dom.service';
import { DepositoryHeadlessService } from '../../services/depository/depository.headless.service';
import { StatisticsService } from '../../services/utils/statistics.service';
import { BookTransformerService } from '../../services/utils/book-transformer.service';

import {
    DepositorySectionList,
    DepositoryAuthMessage,
} from '../../types/book/depository.type';
import { DepositoryEmptyResultsException, DepositoryDOMChangedException, InvalidSearchTermException } from '../../types/exceptions/book.exceptions';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { DepositoryMiddleware } from '../../middlewares/depository.middleware';

import { CommonBookList, CommonBookItem, TrueMessage } from '../../types/book/all.type';
import { INVALID_SEARCH_TERM_NO_NUMBER_MESSAGE } from '../../types/exceptions/exceptions';

/**
 * Controller class for the `/book/depository` endpoint.
 * 
 * @author Szalontai Jordán
 */
@Controller('/book/depository')
export class DepositoryController {

    constructor(private depoDom: DepositoryDOMService,
                private depoHeadless: DepositoryHeadlessService,
                private statistics: StatisticsService,
                private bookTransformer: BookTransformerService) {
    }

    /**
     * Returns a single book based on its ISBN number.
     * 
     * @param ISBN the ISBN number of a book, all possible ISBN values are accepted
     * 
     * @throws `BadRequest` if the ISBN param is not a valid ISBN number
     */
    @Get('/item/:ISBN')
    public async getBookByISBN(@PathParams('ISBN') ISBN: string): Promise<CommonBookItem> {
        try {
            const book = await this.depoDom.getDepositoryBookByISBN(ISBN);
            return this.bookTransformer.transformDepositoryToCommon(book);
        } catch(e) {
            throw new BadRequest(e.message);
        }
    }

    /**
     * Returns a list of all available section names from the Book Depository home page.
     */
    @Get('/sections')
    public async getSections(): Promise<DepositorySectionList> {
        try {
            const sections = await this.depoDom.getDepositoryHomeSections();
            return { sections };
        } catch (e) {
            throw new InternalServerError(e.message);
        }
    }

    /**
     * 
     * Returns a list of books under the given section from the Book Depository home page.
     * 
     * @param sectionName the name of a section at Book Depository home page.
     */
    @Get('/section/:sectionName')
    public async getBookItemsOfSection(
        @PathParams('sectionName') sectionName: string): Promise<CommonBookList> {
        try {
            const books = await this.depoDom.getDepositoryHomeBooksBySection(sectionName);
            return { books: books.map(this.bookTransformer.transformDepositoryToCommon) };
        } catch (e) {
            throw new InternalServerError(e.message);
        }
    }

    /**
     * Returns a list of books from Book Depository based on the `searchTerm`.
     *
     * Also sends the searched term for statistics.
     * 
     * @param searchTerm a string that will represent the search keyword
     * @param page (optional) the page number of the results
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `BadRequest` if the searchTerm is a number, which would implicate an ISBN number
     * @throws `NotFound` if the result list is empty
     * @throws `InternalServerError` if there are some unknown problems (e.g. Book Depository DOM changed thus cannot be parsed)
     */
    @Get('/search/:searchTerm')
    @Get('/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    public async getDepositorySearchResults(
        @PathParams('searchTerm') searchTerm: string,
        @PathParams('page') page: number = 1,
        @Locals('userId') userId: string): Promise<CommonBookList> {
        try {
            if (!!Number(searchTerm)) {
                throw new InvalidSearchTermException(INVALID_SEARCH_TERM_NO_NUMBER_MESSAGE);
            }
            const books = await this.depoDom.getDepositorySearch(searchTerm, page);
            return { books: books.map(this.bookTransformer.transformDepositoryToCommon) };
        } catch (e) {
            if (e instanceof DepositoryEmptyResultsException) {
                throw new NotFound(e.message);
            }
            if (e instanceof InvalidSearchTermException) {
                throw new BadRequest(e.message);
            }
            throw new InternalServerError(e.message);
        } finally {
            this.statistics.sendSearchStatistics(searchTerm, userId);   
        }
    }

    /**
     * Returns a simple message if the Google User Id can be resolved and the user with
     * the given Id is logged in to Book Depository through the application.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     */
    @Get('/auth')
    @UseBefore(GoogleMiddleware, DepositoryMiddleware)
    public async getDepositoryAuth(@Locals('userId') userId: string): Promise<TrueMessage> {
        return { message: 'true' };
    }

    /**
     * Logs in to Book Depository with the given Google User Id if it can be resolved.
     * 
     * @param email email used for login at Book Depository
     * @param password password used for login at Book Depository
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `Unauthorized` if the credentials are wrong
     */
    @Post('/auth/login')
    @UseBefore(GoogleMiddleware)
    public async postLoginToDepository(
        @Required() @BodyParams('email') email: string,
        @Required() @BodyParams('password') password: string,
        @Locals('userId') userId: string): Promise<DepositoryAuthMessage> {
        try {
            const success = await this.depoHeadless.login(email, password, userId);
            return { auth: success };
        } catch (e) {
            throw new Unauthorized(e.message);
        }
    }

    /**
     * Logs out from Book Depository with the given Google User Id if it can be resolved.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `Unauthorized` if the user weren't logged in with the given Google User Id
     */
    @Post('/auth/logout')
    @UseBefore(GoogleMiddleware, DepositoryMiddleware)
    public async postLogoutFromDepository(@Locals('userId') userId: string): Promise<DepositoryAuthMessage> {
        try {
            const success = await this.depoHeadless.logout(userId);
            return { auth: success };
        } catch (e) {
            throw new Unauthorized(e.message);
        }
    }

    /**
     * Returns a list of books from the user's Book Depository wishlist, if they are logged in.
     * 
     * @param userId the id resolved by the `GoogleMiddleware`
     * 
     * @throws `Unauthorized` if the user is not logged in
     * @throws `InternalServerError` if there are some unknown problems (e.g. Book Depository DOM changed thus cannot be parsed)
     */
    @Get('/wishlist')
    @UseBefore(GoogleMiddleware, DepositoryMiddleware)
    public async getDepositoryWishlist(@Locals('userId') userId: string): Promise<CommonBookList> {
        try {
            const books = await this.depoHeadless.getWishlistItems(userId);
            return { books: books.map(this.bookTransformer.transformDepositoryWishlistToCommon) };
        } catch (e) {
            if (e instanceof DepositoryDOMChangedException) {
                throw new InternalServerError(e.message);
            }
            throw new Unauthorized(e.message);
        }
    }
}
