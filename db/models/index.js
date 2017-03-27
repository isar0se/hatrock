'use strict';

// Require our models. Running each module registers the model into sequelize
// so any other part of the application could call sequelize.model('User')
// to get access to the User model.

const User = require('./user')
const OAuth = require('./oauth')
const Set = require('./set')
const Video = require('./video')

Video.belongsTo(Set)
Set.hasMany(Video)

Set.belongsTo(User)
User.hasMany(Set)

OAuth.belongsTo(User)
User.hasOne(OAuth)

module.exports = {User}
