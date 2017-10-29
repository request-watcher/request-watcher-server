const CRUD = require('./crud')

const Logger = function(params) {
    const { uuid, username, appname, createdAt, logger, labels } = params

    // TODO: validator

    return {
        uuid, username, appname, createdAt, logger, labels
    }
}

Logger.insertDocuments = CRUD.insertDocuments('logger', Logger)
Logger.deleteDocument = CRUD.deleteDocument('logger')
Logger.findDocuments = CRUD.findDocuments('logger')

module.exports = Logger