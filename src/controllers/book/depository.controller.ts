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
import { CommonBookList, CommonBookItem } from '../../types/book/all.type';
import { INVALID_SEARCH_TERM_NO_NUMBER_MESSAGE } from '../../types/exceptions/exceptions';

@Controller('/book/depository')
export class DepositoryController {

    constructor(private depoDom: DepositoryDOMService,
                private depoHeadless: DepositoryHeadlessService,
                private statistics: StatisticsService,
                private bookTransformer: BookTransformerService) {
    }

    @Get('/item/:ISBN')
    public async getBookByISBN(@PathParams('ISBN') ISBN: string): Promise<CommonBookItem> {
        try {
            const book = await this.depoDom.getDepositoryBookByISBN(ISBN);
            return this.bookTransformer.transformDepositoryToCommon(book);
        } catch(e) {
            throw new BadRequest(e.message);
        }
    }

    @Get('/sections')
    public async getSections(): Promise<DepositorySectionList> {
        try {
            const sections = await this.depoDom.getDepositoryHomeSections();
            return { sections };
        } catch (e) {
            throw new InternalServerError(e.message);
        }
    }

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

    @Post('/auth/logout')
    @UseBefore(GoogleMiddleware)
    public async postLogoutFromDepository(@Locals('userId') userId: string): Promise<DepositoryAuthMessage> {
        try {
            const success = await this.depoHeadless.logout(userId);
            return { auth: success };
        } catch (e) {
            throw new Unauthorized(e.message);
        }
    }


    @Get('/wishlist')
    @UseBefore(GoogleMiddleware)
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
