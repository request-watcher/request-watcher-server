const R = require('ramda')
const config = require('../config')

const MongoClient = require('mongodb').MongoClient
const url = config.DB.url

const connect = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(url, function(err, db) {
            err ? reject(err) : resolve(db)
        })
    })
}

const insertDocuments = function(collection, validator, documents) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(documents)) {
            reject(new Error('documents should be an array'))
        }
        connect()
            .then(db => {
                const invalidDocuments = []
                const validDocuments = []
                documents.forEach(document => {
                    try {
                        validDocuments.push(validator(document))
                    } catch (error) {
                        invalidDocuments.push({document, error})
                    }
                })
                db.collection(collection).insertMany(validDocuments, function(err, result) {
                    if (err) {
                        db.close()
                        reject(err)
                    } else {
                        db.close()
                        resolve({success: result, fail: invalidDocuments})
                    }
                })
            })
            .catch(err => reject(err))
    })
}

const deleteDocument = function(collection, queries) {
    return new Promise((resolve, reject) => {
        connect()
            .then(db => {
                db.collection(collection).deleteOne(queries, function(err, result) {
                    if (err) {
                        db.close()
                        reject(err)
                    } else {
                        db.close()
                        resolve(result)
                    }
                })
            })
            .catch(err => reject(err))
    })
}

const findDocuments = function(collection, queries) {
    return new Promise((resolve, reject) => {
        connect()
            .then(db => {
                db.collection(collection).find(queries).toArray(function(err, result) {
                    if (err) {
                        db.close()
                        reject(err)
                    } else {
                        db.close()
                        resolve(result)
                    }
                })
            })
            .catch(err => reject(err))
    })
}

module.exports = {
    insertDocuments: R.curry(insertDocuments),
    deleteDocument: R.curry(deleteDocument),
    findDocuments: R.curry(findDocuments)
}