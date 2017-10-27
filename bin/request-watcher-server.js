#! /usr/bin/env node

const server = require('../index.js')
const program = require('commander')

program
  .version('1.0.0')
  .usage('[options] <target ...>')
  .option('-p, --port <port>', 'Port to use(default to 2333)')
  .option('-a, --address <address>', 'Address to use(default to 0.0.0.0)')
  // .option('-d, --debug', 'To debug')
  .parse(process.argv)

let {port, address, debug} = program
address = address || '0.0.0.0'
port = port || '2333'

console.log(`server is on ${address}:${port}`)
server.listen(port, address)