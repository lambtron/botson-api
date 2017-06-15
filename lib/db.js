
/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Account = new Schema({ user_id: Number, screen_name: String, categories: { content: Number, friend: Number, network: Number, sentiment: Number, temporal: Number, user: Number }, scores: { english: Number, universal: Number }})
const AccountModel = mongoose.model('Account', Account)

/**
 * Connect.
 */

mongoose.connect('mongodb://localhost/botbusters');

/**
 * Expose account.
 */

exports.account = AccountModel;

/**
 * Error handling.
 */

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
  console.log('Mongoose connected');
});


