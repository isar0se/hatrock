'use strict'

const app = require('APP')
const debug = require('debug')(`${app.name}:set`)
const Sequelize = require('sequelize')
const db = require('APP/db')

const Set = db.define('sets', {
  name: Sequelize.STRING,
  description: Sequelize.STRING
})

module.exports = Set