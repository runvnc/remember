express = require 'express'
app = express()
fs = require 'fs'

process.on 'uncaughtException', (er) ->
  console.log er

app.configure ->
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.static __dirname + '/public'
  app.use express.errorHandler { dumpExceptions: true, showStack: true }

app.get '/', (req, res) ->
  res.render 'index.html'

app.post '/data', (req, res) ->
  str = "#{req.body.id}\t#{req.body.found}\t#{req.body.missed}\n"
  fs.open 'public/trialdata.txt', 'a', 666, ( e, id ) ->
    fs.write  id, str, null, 'utf8', ->
      fs.close id
  res.end('ok')

app.listen 3111
console.log "Express server listening on port 3111"


