const Model = require('./index')
const requestData = {
    uuid: '1',
    username: 'lisiur',
    appname: 'test-app',
    labels: ['test', 'lisiur'],
    request: {
        url: 'https://lisiur.com',
        params: {
            user: 'lisiur',
        },
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

Model.Request.insertDocuments([requestData])
    .then(res => {
        console.log(res)
    })
    .catch(err => {
        console.log(err)
    })