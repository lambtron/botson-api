
/**
 * Module dependencies.
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Account = new Schema({ user_id: String, screen_name: String, reqs: Number, last_computed: Date, tweets: [{ id: String, created_at: Date }], tweet_rate_daily: Number, categories: { content: Number, friend: Number, network: Number, sentiment: Number, temporal: Number, user: Number }, scores: { english: Number, universal: Number }})
const AccountModel = mongoose.model('Account', Account)
const mongo_url = process.env.MONGODB_URI
mongoose.Promise = global.Promise;

/**
 * Connect.
 */

mongoose.connect(mongo_url);

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
