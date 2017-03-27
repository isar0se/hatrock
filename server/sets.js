const app = require('APP'), {env} = app
const debug = require('debug')(`${app.name}:set`)

const db = require('APP/db')
const Set = db.model('sets')
const Video = db.model('videos')

module.exports = require('express').Router()
	.get('/', (req, res, next) => {
		// get all user's sets for display
		res.status(201).send("OKAY!")
	})
	.post('/', (req, res, next) => {
		Set.create(req.body, { include: [ Video ]})
			.then((createdSet) => {
				res.status(201).json(createdSet)
			})
			.catch(next)
	})