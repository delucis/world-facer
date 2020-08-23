# world-facer

[![Build Status](https://travis-ci.com/delucis/world-facer.svg?token=vMggSwUMhr68RUsUzVGb&branch=latest)](https://travis-ci.com/delucis/world-facer)
[![Coverage Status](https://coveralls.io/repos/github/delucis/world-facer/badge.svg?branch=master)](https://coveralls.io/github/delucis/world-facer?branch=master)

> Data scraping, processing, and presentation for [_I began the day inside the
> world trying to look at it, but it was lying on my face,
> making it hard to see._][ibtd], for variable ensemble, video and audio playback

  [ibtd]: http://chrisswithinbank.net/2018/11/i-began-the-day-inside-the-world-trying-to-look-at-it-but-it-was-lying-on-my-face-making-it-hard-to-see/
  
---

<p align="center">⚠️</p>

<p align="center">
  
  This repository represents the source code for an artistic project and
  will likely be broken outside of some fairly specific contexts.
  It is shared here in case any small parts of it may be of interest,
  but is not really designed for re-use, so please be warned if it misfires
  or eats your hard-drive.
  
</p>

<p align="center">⚠️</p>

---

## Installation

```
git clone https://github.com/delucis/world-facer.git
cd world-facer
npm install
```

## Set up

### Required environment variables

Before using `world-facer`, you need some additional secure values in your
environment variables. These can be added manually (in CI or on the command
line) or stored in a [`.env`][b9da293a] file that should never be committed.

  [b9da293a]: https://www.npmjs.com/package/dotenv "dotenv NPM package"
  
#### For the `bootstrap` script

variable name             | description
--------------------------|------------
`INSTAPAPER_API_KEY`      | Instapaper API consumer key ([get one →][d5e83b7a])
`INSTAPAPER_API_SECRET`   | Instapaper API consumer secret
`INSTAPAPER_LOGIN_KEY`    | an Instapaper user’s e-mail address
`INSTAPAPER_LOGIN_SECRET` | an Instapaper user’s password

#### For the `serve-news` script

variable name             | description
--------------------------|------------
`NGROK_TOKEN`             | An [ngrok auth token][2f180649] for the news server
`NGROK_SUBDOMAIN`         | A custom subdomain for the ngrok URL<sup>*</sup>  

<sup>* Requires a paid ngrok account</sup>

  [d5e83b7a]: https://www.instapaper.com/main/request_oauth_consumer_token "Register New OAuth Application - Instapaper"
  [2f180649]: https://dashboard.ngrok.com/ "ngrok dashboard"

### Initialising `world-facer`

Once the environment variables are available, run the `bootstrap` script to
collect data and prepare `world-facer`. This will probably take quite a while
as it involves thousands of calls to scrape data from the internet and some
fairly slow analysis tasks.

```
npm run bootstrap
```

The various online data that `world-facer` depends on change over time.
Running `bootstrap` again will update the data, only fetching anything that
hasn’t already been fetched.


## Scripts

The following are some of the main tools this package provides.

### `npm run sketch`

Runs an interactive terminal interface, which allows you to select from the
sketches in [`lib/face-sketcher/sketches`](lib/face-sketcher/sketches) and
render them to video files.

Outputs to `build/face-sketcher`.

### `npm run make-cues`

Generates audio cues with instructions to the performers (for version 1 of
the piece), using the `say` command.

Outputs to `build/cue-speaker`.

### `npm run read-news`

Generates audio files from randomly selected sentences in the data, using
the `say` command. This was used for first version of the piece and manually
combined with the cue files from the `make-cues` script.

Outputs to `build/news-reader`.

### `npm run serve-news`

Serve a web app from which performers can generate and download audio files
for use during performances. When the server is started it will log a public
URL, which is provided using [`ngrok`][46d40db0].

Audio files generated from the web app are output to `build/news-maker`.

  [46d40db0]: https://ngrok.com/
