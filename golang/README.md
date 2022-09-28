# installation

* install git
* install go version 1.19
* clone code in `$GOPATH/src/github.com/ezrx` directory
* cd notification-service
* go run github.com/99designs/gqlgen generate
* run `go run server.go &` it will start server in the background


Query

mutation {
    createSimpleNotification (input : {
        langCode: "en",
        userId : 101,
        orderId : 8001,
        orderType : "NewOrder",
        orderDescription : "custom description",
        hyperLink : "http://www.google.com"
    }) {
        langCode
        userId
        orderId
        orderType
        orderDescription
        hyperLink
    }
}
----
mutation {
    markRead(input : {
        id : 8010
    }) {
        id
        orderId
        orderType
        status
        orderDescription
        hyperLink
        createdTime
        userId
        langCode
    }
}
---
    query {
        simpleNotifications (input : {
            count : 5
            offset :0
            langCode: "en"
            userId : 101
        }) {
            notifications {
            langCode
            userId
            orderId
            orderType
            orderDescription
            hyperLink
            status
            }
            nextOffset,
            numberOfUnreadNotifications
        }
    }
