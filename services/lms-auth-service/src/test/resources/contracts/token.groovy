import org.springframework.cloud.contract.spec.Contract

Contract.make {
    description "should return a token when valid credentials are provided"
    request {
        method 'POST'
        urlPath('/api/v1/auth/token') {
            queryParameters {
                parameter("grant_type", "password")
                parameter("username", "user")
                parameter("password", "pass")
            }
        }
    }
    response {
        status OK()
        body([
            accessToken: "some-access-token",
            refreshToken: "some-refresh-token",
            tokenType: "Bearer",
            expiresIn: 900
        ])
        headers {
            contentType(applicationJson())
        }
    }
}
