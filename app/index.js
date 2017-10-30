const Koa = require('koa')
const KoaBodyParser = require('koa-bodyparser')
const json = require('koa-json')
const Router = require('koa-router')
const serve = require('koa-static')
const path = require('path')
const cors = require('koa2-cors')
const moment = require('moment')

const app = new Koa()
const router = new Router()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

const Model = require('./models')

let totalUsers = 0

io.on('connection', function(socket) {
  totalUsers += 1
  let time = moment().format('YYYY/MM/DD HH:mm:ss')
  console.log(`[${time}] user connected (current users: ${totalUsers})`)
  socket.on('disconnect', function() {
    totalUsers -= 1
    time = moment().format('YYYY/MM/DD HH:mm:ss')
    console.log(`[${time}] user disconnected (current users: ${totalUsers})`)
  })
})

router.post('/return-json', function(ctx, next) {
  ctx.body = {
    bar: 'foo'
  }
})

router.post('/receiver', (ctx, next) => {
  const saveMe = !!ctx.request.body.save // need to save to db ?
  let uuid = ctx.request.body && ctx.request.body.uuid.slice(0, 5) // only show short version

  // created time
  const createdAt = ctx.request.body.createdAt
  let time = '????/??/?? ??:??:??'
  if (createdAt) {
    time = moment(createdAt).format('YYYY/MM/DD HH:mm:ss')
  }

  if (ctx.request.body.request) { // request
    io.emit('request', ctx.request.body)
    console.log(`[${time}] emit request (${uuid}) ${ctx.request.body.request.url}`)
  } else if (ctx.request.body.response) { // response
    io.emit('response', ctx.request.body)
    console.log(`[${time}] emit response(${uuid})`)
  } else if (ctx.request.body.logger) { // logger
    io.emit('logger', ctx.request.body)
    console.log(`[${time}] emit logger  (${uuid}) ${ctx.request.body.logger.title}`)
  } else {
    console.log('invalid request', ctx.request.body)
  }

  if (saveMe) {
    if (ctx.request.body.request) { // request
      Model.Request.insertDocuments([ctx.request.body])
    } else if (ctx.request.body.response) { // response
      Model.Response.insertDocuments([ctx.request.body])
    } else if (ctx.request.body.logger) { // logger
      Model.Logger.insertDocuments([ctx.request.body])
    } else {
    }
  }

  ctx.body = {
    result: 'success'
  }
})

router.post('/history', async (ctx, next) => {
  let { appname, username, startTime, endTime, labels, type = 'request' } = ctx.request.body
  const queries = {}
  if (appname) {
    queries.appname = appname
  }
  if (username) {
    queries.username = username
  }
  if (labels && Array.isArray(labels)) {
    queries.labels = { $all: labels }
  }
  if (startTime && endTime) {
    queries.createdAt = { $gt: startTime, $lt: endTime }
  } else if (startTime) {
    queries.createdAt = { $gt: startTime } 
  } else if (endTime) {
    queries.createdAt = { $lt: endTime } 
  } else { }

  if (type === 'request') {
    try {
      let [requests, responses] = await Promise.all([
        Model.Request.findDocuments(queries)
        Model.Response.findDocuments(queries)
      ])
      requests.forEach(request => {
        request.response = responses.find(response => response.uuid === request.uuid)
      })
      ctx.body = requests
    } catch (err) {
      console.log(err)
    }
  } else if (type === 'logger') {
    try {
      let loggers = Model.Logger.findDocuments(queries)
      ctx.body = loggers
    } catch (err) {
      console.log(err)
    }
  }
})

const root = path.resolve(__dirname, '../www')
const opts = {}
app.use(cors())
app.use(serve(root, opts))
app.use(KoaBodyParser())
app.use(json())
app.use(router.routes())


module.exports = server