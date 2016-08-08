'use strict'

const list = require('browserslist')
const Saucelabs = require('saucelabs')
const saucelabs = new Saucelabs()
const query = require('saucelabs-finder')

const translations = {
  'safari': 'safari',
  'opera': 'opera',
  'ios_saf': 'iphone',
  'ie_mob': 'internet explorer',
  'ie': 'internet explorer',
  'firefox': 'firefox',
  'chrome': 'chrome',
  'android': 'android',
  'and_chr': 'android',
  'edge': 'microsofedge'
}

var loadedBrowsers = false

function setupFunction () {
  return new Promise(function (resolve, reject) {
    saucelabs.getWebDriverBrowsers(function (error, browsers) {
      if (error) reject(new Error(error))
      query.load(browsers)
      resolve()
    })
  })
}

function generateCapabilitiesArray (string) {
  return new Promise(function (resolve, reject) {
    let browsersFound = {}
    let browsersWanted = list(string)

    browsersWanted.forEach(function (blistName) {
      var parsed = blistName.split(' ')
      var browser = parsed[0]
      var version = parsed[1]
      var found = query.find(translations[browser], version)
      if (Object.keys(found).length === 0) {
        // console.log('could not find %s version %s', browser, version)
      }
      Object.keys(found).forEach(function (key) {
        browsersFound[key] = found[key]
      })
    })

    let capabilitiesArray = []
    Object.keys(browsersFound).forEach(function (key) {
      var browser = browsersFound[key]
      var capabilities = {
        browserName: browser.api_name,
        platform: browser.os,
        version: browser.short_version,
        name: browser.long_name + ' ' + browser.short_version
      }
      capabilitiesArray.push(capabilities)
    })

    resolve(capabilitiesArray)
  })
}

function generateCapabilities (string) {
  return setupFunction()
  .then(function () {
    return generateCapabilitiesArray(string)
  })
}

module.exports = generateCapabilities
