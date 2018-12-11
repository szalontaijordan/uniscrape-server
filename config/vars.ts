export const config = {
    db: {
        testURI: `mongodb://admin1234:admin1234@ds131601.mlab.com:31601/uniscrape_test`
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
    }
}
