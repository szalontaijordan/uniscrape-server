import { BodyParams, Controller, Locals, Post,  Get, Required, UseBefore, PathParams } from '@tsed/common';

import { DepositoryDOMService } from '../../services/depository/depository.dom.service';
import { DepositoryHeadlessService } from '../../services/depository/depository.headless.service';

import {
    DepositoryCommonErrorResponse,
    DepositoryAuthErrorResponse,
    DepositoryEmptyResultsErrorResponse
} from '../../types/error-responses/depository.error-response';

import {
    DepositorySectionList,
    DepositoryBookList, 
    DepositoryAuthMessage,
    DepositoryWishlist
} from '../../types/book/depository.type';

import {
    BookDepositoryDOMChangedException,
    BookDepositoryEmptyResultsException
} from '../../types/exceptions/book.exceptions';

import { GoogleMiddleware } from '../../middlewares/google.middleware';
import { StatisticsService } from '../../services/utils/statistics.service';

@Controller('/book/depository')
export class DepositoryController {

    constructor(private depoDom: DepositoryDOMService,
                private depoHeadless: DepositoryHeadlessService,
                private statistics: StatisticsService) {
    }

    @Get('/sections')
    public async getSections(): Promise<DepositorySectionList> {
        try {
            const sections = await this.depoDom.getDepositoryHomeSections();
            return { sections };
        } catch (e) {
            throw new DepositoryCommonErrorResponse(e);
        }
    }

    @Get('/section/:sectionName')
    public async getBookItemsOfSection(
        @PathParams('sectionName') sectionName: string): Promise<DepositoryBookList> {
        try {
            const books = await this.depoDom.getDepositoryHomeBooksBySection(sectionName);
            return { books };
        } catch (e) {
            throw new DepositoryCommonErrorResponse(e);
        }
    }

    @Get('/search/:searchTerm')
    @Get('/search/:searchTerm/:page')
    @UseBefore(GoogleMiddleware)
    public async getDepositorySearchResults(
        @PathParams('searchTerm') searchTerm: string,
        @PathParams('page') page: number = 1,
        @Locals('userId') userId: string): Promise<DepositoryBookList> {
        try {
            const books = await this.depoDom.getDepositorySearch(searchTerm, page);
            return { books };
        } catch (e) {
            if (e instanceof BookDepositoryEmptyResultsException) {
                throw new DepositoryEmptyResultsErrorResponse(e);
            }
            throw new DepositoryCommonErrorResponse(e);
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
            throw new DepositoryAuthErrorResponse(e);
        }
    }

    @Post('/auth/logout')
    @UseBefore(GoogleMiddleware)
    public async postLogoutFromDepository(@Locals('userId') userId: string): Promise<DepositoryAuthMessage> {
        try {
            const success = await this.depoHeadless.logout(userId);
            return { auth: success };
        } catch (e) {
            throw new DepositoryAuthErrorResponse(e);
        }
    }


    @Get('/wishlist')
    @UseBefore(GoogleMiddleware)
    public async getDepositoryWishlist(@Locals('userId') userId: string): Promise<DepositoryWishlist> {
        try {
            const books = await this.depoHeadless.getWishlistItems(userId);
            return { books };
        } catch (e) {
            if (e instanceof BookDepositoryDOMChangedException) {
                throw new DepositoryCommonErrorResponse(e);
            }
            throw new DepositoryAuthErrorResponse(e);
        }
    }
}
