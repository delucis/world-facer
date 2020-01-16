const path = require('path')
const app = require('express')()
const http = require('http').Server(app)
const format = require('date-fns/format')
const ngrok = require('ngrok')
// populate environment variables from a '.env' file
require('dotenv').config()
const PW = require('../paper-words')
const makeCue = require('../news-maker')

const PORT = 3000
let URL

function logReq (msg, req) {
  console.log(`${format(Date.now(), 'HH:mm:ss')} — ${msg} (${req.headers['x-forwarded-for']})`)
}

/**
 * Connect to ngrok and receive a public URL for your Express server
 * @param {Number} [port=3000] The number of the port to tunnel to
 * @return {Promise<String>} The ngrok URL your server is available at
 */
async function ngrokInit (port = PORT) {
  await PW.data() // prime paper words cache
  const options = { addr: port, inspect: false }
  if (process.env.NGROK_TOKEN) options.authtoken = process.env.NGROK_TOKEN
  if (process.env.NGROK_SUBDOMAIN) {
    options.subdomain = process.env.NGROK_SUBDOMAIN
  }
  return ngrok.connect(options)
}

// Define our server’s response for the '/' path (the homepage):
// send index.html
app.get('/', (req, res) => {
  logReq('Loaded news server', req)
  res.sendFile(path.join(__dirname, 'src/index.html'))
})

app.get('/site.webmanifest', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/site.webmanifest'))
})

app.get('/news-address', async function (req, res) {
  try {
    logReq('Requested new cue', req)
    const address = await makeCue({ pad: true })
    res.send(address)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get(/^\/news-maker\/\d{8}-\d{6}.\d{3}-\d{1,4}\.mp[34]$/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', req.path))
})

app.get(/^\/fonts\/gt-cinetype-regular-webfont\.woff2?$/, (req, res) => {
  res.sendFile(path.join(__dirname, 'src', req.path))
})

// Listen for connections on the correct port
http.listen(PORT, function () {})

// Call our ngrok initialiser and once we have established a connection,
// post and output the URL to Max
ngrokInit(PORT)
  .then(url => {
    URL = url
    console.log(URL)
  })
  // If there are any errors, catch them and report them to the console
  // (the console is available using the [node.debug] object in Max)
  .catch(console.error)
