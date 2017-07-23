
/**
 * Module dependencies.
 */

const account = require('./db').account
const moment = require('moment')

/**
 * Upsert twitter handle.
 */

exports.upsert = async function upsert(user, tweets, botometer_res) {
  return await account.findOneAndUpdate({ user_id: user.user_id }, update(user, tweets, botometer_res), { upsert: true, new: true })
};

/**
 * Get account.
 */

exports.get = async function get(user_id) {
  return await account.findOne({ user_id: user_id })
}

/**
 * Increment account.req.
 */

exports.increment = async function increment(user) {
  user.reqs++
  return await account.findOneAndUpdate({ user_id: user.user_id }, user, { upsert: true, new: true })
}

/**
 * Private function to parse botometer response, tweets, etc., into an `Account` user.
 */

function update(user, tweets, botometer_res) {
  return {
    user_id: user.user_id,
    screen_name: user.screen_name,
    reqs: 0,
    last_computed: new Date(),
    tweets: tweets,
    tweet_rate_daily: calculate_tweet_daily_rate(tweets),
    categories: botometer_res.categories,
    scores: botometer_res.scores
  }
}

/**
 * Calculate tweet daily rate.
 */

function calculate_tweet_daily_rate(tweets) {
  const first = tweets[0]
  const last = tweets[tweets.length - 1]
  return tweets.length / moment(new Date(first.created_at)).diff(new Date(last.created_at), 'days')
}

