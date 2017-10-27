const Koa = require('koa')
const KoaBodyParser = require('koa-bodyparser')
const json = require('koa-json')
const Router = require('koa-router')
const serve = require('koa-static')
const path = require('path')
const cors = require('koa2-cors')

const app = new Koa()
const router = new Router()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

io.on('connection', function(socket) {
  console.log('a user connected')
  socket.on('disconnect', function() {
    console.log('user disconnected')
  })
})

router.post('/return-json', function(ctx, next) {
  ctx.body = {
    bar: 'foo'
  }
})

router.post('/receiver', (ctx, next) => {
  if (ctx.request.body.request) {
    io.emit('request', ctx.request.body)
    console.log('emit request ', '[' + ctx.request.body.uuid.slice(0,5) + ']', ctx.request.body.request.url)
  } else if (ctx.request.body.response) {
    io.emit('response', ctx.request.body)
    console.log('emit response', '[' + ctx.request.body.uuid.slice(0,5) + ']')
  } else if (ctx.request.body.logger) {
    io.emit('logger', ctx.request.body)
    console.log('emit logger  ', '[' + ctx.request.body.uuid.slice(0,5) + ']', ctx.request.body.logger.title)
  }

  ctx.body = {
    result: 'success'
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