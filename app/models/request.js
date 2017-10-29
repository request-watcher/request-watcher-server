const CRUD = require('./crud')

const Request = function(params) {
    const { uuid, username, appname, createdAt, request, labels } = params

    // TODO: validator

    return {
        uuid, username, appname, createdAt, request, labels
    }
}

Request.insertDocuments = CRUD.insertDocuments('request', Request)
Request.deleteDocument = CRUD.deleteDocument('request')
Request.findDocuments = CRUD.findDocuments('request')

module.exports = Request