export const config = {
    db: {
        testURI: `mongodb://admin1234:admin1234@ds131601.mlab.com:31601/uniscrape_test`
    },
    ebay: {
        prodAppId: 'JordnSza-UniScrap-PRD-c60a78903-98d69895',
        sandboxAppId: 'JordnSza-UniScrap-SBX-b60c321e5-6269a421',
        findingApiSandboxUrl: 'http://svcs.sandbox.ebay.com/services/search/FindingService/v1',
        findingApiProdUrl: 'http://svcs.ebay.com/services/search/FindingService/v1',
        query: '?OPERATION-NAME=findItemsByKeywords' +
            '&SERVICE-VERSION=1.0.0' +
            '&SECURITY-APPNAME=#APPID#' +
            '&RESPONSE-DATA-FORMAT=JSON' +
            '&REST-PAYLOAD' +
            '&keywords=#KEYWORDS#' +
            '&paginationInput.pageNumber=#PAGE#'
    },
    google: {
        "web": {
            "client_id": "695322178173-7c01bp19lh7gjksaskq93i4bs011qtt4.apps.googleusercontent.com",
            "project_id": "uniscrape-1542655455395",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://www.googleapis.com/oauth2/v3/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "nH84hIl8ba9ddz2UjEkddYDM",
            "javascript_origins": [
                "http://localhost:3000"
            ]
        }
    },
    regex: {
        ISBN_VALIDATOR: /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/
    }
}
