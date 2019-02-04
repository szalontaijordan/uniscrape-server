export interface EbayApiKeywordsResponse {
    findItemsByKeywordsResponse: Array<{
        ack: Array<string>,
        version: Array<string>,
        timestamp: Array<string>,
        searchResult: Array<{
            ['@count']: number,
            item: Array<EbayKeywordsResult>
        }>,
        paginationOutput: Array<{
            pageNumber: Array<string>,
            entriesPerPage: Array<string>,
            totalPages: Array<string>,
            totalEntries: Array<string>
        }>,
        itemSearchURL: Array<string>
    }>;
}

export interface EbayBookList {
    books: Array<EbayKeywordsResult>;
}

export interface EbayKeywordsResult {
    itemId: string[];
    title: string[];
    globalId: string[];
    galleryURL: string[];
    primaryCategory: PrimaryCategory[];
    viewItemURL: string[];
    productId: ProductId[];
    paymentMethod: string[];
    autoPay: string[];
    postalCode: string[];
    location: string[];
    country: string[];
    shippingInfo: ShippingInfo[];
    sellingStatus: SellingStatu[];
    listingInfo: ListingInfo[];
    returnsAccepted: string[];
    condition: Condition[];
    isMultiVariationListing: string[];
    topRatedListing: string[];
}

export interface PrimaryCategory {
    categoryId: string[];
    categoryName: string[];
}

export interface ProductId {
    ['@type']: string;
    __value__: string;
}

export interface ShippingServiceCost {
    ['@currencyId']: string;
    __value__: string;
}

export interface ShippingInfo {
    shippingServiceCost: ShippingServiceCost[];
    shippingType: string[];
    shipToLocations: string[];
    expeditedShipping: string[];
    oneDayShippingAvailable: string[];
    handlingTime: string[];
}

export interface CurrentPrice {
    ['@currencyId']: string;
    __value__: string;
}

export interface ConvertedCurrentPrice {
    ['@currencyId']: string;
    __value__: string;
}

export interface SellingStatu {
    currentPrice: CurrentPrice[];
    convertedCurrentPrice: ConvertedCurrentPrice[];
    sellingState: string[];
    timeLeft: string[];
}

export interface ListingInfo {
    bestOfferEnabled: string[];
    buyItNowAvailable: string[];
    startTime: Date[];
    endTime: Date[];
    listingType: string[];
    gift: string[];
}

export interface Condition {
    conditionId: string[];
    conditionDisplayName: string[];
}
