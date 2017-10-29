const CRUD = require('./crud')

const Response = function(params) {
    const { uuid, username, appname, createdAt, response, labels } = params

    // TODO: validator

    return {
        uuid, username, appname, createdAt, response, labels
    }
}

Response.insertDocuments = CRUD.insertDocuments('response', Response)
Response.deleteDocument = CRUD.deleteDocument('response')
Response.findDocuments = CRUD.findDocuments('response')

module.exports = Response