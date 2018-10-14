# world-facer

[![Build Status](https://travis-ci.com/delucis/world-facer.svg?token=vMggSwUMhr68RUsUzVGb&branch=latest)](https://travis-ci.com/delucis/world-facer) [![Coverage Status](https://coveralls.io/repos/github/delucis/world-facer/badge.svg?branch=master)](https://coveralls.io/github/delucis/world-facer?branch=master)

> Scrape and present various data, preparing for Rainy Days

## Installation

```
git clone https://github.com/delucis/world-facer.git
cd world-facer
npm install
```

## Set up

### Required environment variables

Before running `world-facer`, you need some additional secure values in your environment variables. These can be added manually (in CI or on the command line) or stored in a [`.env`][b9da293a] file that should never be committed.

  [b9da293a]: https://www.npmjs.com/package/dotenv "dotenv NPM package"

variable name             | description
--------------------------|------------
`INSTAPAPER_API_KEY`      | Instapaper API consumer key ([get one →][d5e83b7a])
`INSTAPAPER_API_SECRET`   | Instapaper API consumer secret
`INSTAPAPER_LOGIN_KEY`    | an Instapaper user’s e-mail address
`INSTAPAPER_LOGIN_SECRET` | an Instapaper user’s password

  [d5e83b7a]: https://www.instapaper.com/main/request_oauth_consumer_token "Register New OAuth Application - Instapaper"

### Initialising `world-facer`

Once the environment variables are available, run the `bootstrap` script to collect data and prepare `world-facer`. This will probably take quite a while as it involves thousands of calls to scrape data from the internet.

```
npm run bootstrap
```

The various online data that `world-facer` depends on change over time. Running `bootstrap` again will update the data, only fetching anything that hasn’t already been fetched.
