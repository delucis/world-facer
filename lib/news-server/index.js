const path = require('path')
const app = require('express')()
const http = require('http').Server(app)
const ngrok = require('ngrok')
// populate environment variables from a '.env' file
require('dotenv').config()
const PW = require('../paper-words')
const makeCue = require('../news-maker')

const PORT = 3000
let URL

/**
 * Connect to ngrok and receive a public URL for your Express server
 * @param {Number} [port=3000] The number of the port to tunnel to
 * @return {Promise<String>} The ngrok URL your server is available at
 */
async function ngrokInit (port = PORT) {
  await PW() // prime paper words cache
  const options = { addr: port }
  if (process.env.NGROK_TOKEN) options.authtoken = process.env.NGROK_TOKEN
  return ngrok.connect(options)
}

// Define our server’s response for the '/' path (the homepage):
// send index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/index.html'))
})

app.get('/site.manifest', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/site.manifest'))
})

app.get('/news-address', async function (req, res) {
  try {
    const address = await makeCue()
    res.send(address)
  } catch (e) {
    res.status(500).send(e)
  }
})

app.get(/^\/audio\/\d{14}\.mp4$/, (req, res) => {
  res.sendFile(path.join(__dirname, req.path))
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
