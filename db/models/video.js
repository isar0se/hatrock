'use strict'

const app = require('APP')
const debug = require('debug')(`${app.name}:video`)
const Sequelize = require('sequelize')
const db = require('APP/db')

const Video = db.define('videos', {
	title: Sequelize.STRING,
	thumbnail: Sequelize.STRING,
	videoURL: Sequelize.STRING,
	direction: Sequelize.ENUM('Left', 'Right'),
})

module.exports = Video
