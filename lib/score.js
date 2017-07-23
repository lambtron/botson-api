
/**
 * Module dependencies.
 */

const db_account = require('./db-account')
const botometer = require('./botometer')
const twitter = require('./twitter')
const moment = require('moment')
const score = require('./score')
const MAX_AGE_HOURS = 48
const MIN_AGE_HOURS = 12
const NEW_TWEETS = 100
const MAX_REQS = 10

/**
 * Get botometer score.
 */

exports.get = async function get(user, auth) {
  const account = await db_account.get(user.user_id)
  let ret = account

  // if no account, or the account is legacy, then compute and save with new attributes
  if (!account || !account.last_computed || !account.tweets || !account.tweet_rate_daily) {
    const tweets = await twitter.get_tweets(user.user_id, auth)
    const mentions = await twitter.get_mentions(user.screen_name, auth)
    const botometer_res = await botometer.check_account({ id: user.user_id, screen_name: user.screen_name }, tweets, mentions)
    ret = await db_account.upsert({ user_id: user.user_id, screen_name: user.screen_name }, parse_tweets(tweets), botometer_res)
  }

  // if account, then..
  else {
    const age_in_hours = moment(new Date()).diff(account.last_computed, 'hours')

    // if `age` is less than 12 hours
    if (age_in_hours < MIN_AGE_HOURS) return await db_account.increment(account)

    // Get new tweets.
    const tweets = await twitter.get_tweets(user.user_id, auth)
    const new_tweets = calculate_new_tweets(parse_tweets(tweets), account.tweets)

    // if `age` is greater than 12 hours
    if (age_in_hours < MAX_AGE_HOURS && new_tweets <= NEW_TWEETS && reqs < MAX_REQS) return await db_account.increment(account)

    // Compute new score and update.
    const mentions = await twitter.get_mentions(user.screen_name, auth)
    const botometer_res = await botometer.check_account({ id: user.user_id, screen_name: user.screen_name }, tweets, mentions)
    ret = await db_account.upsert({ user_id: user.user_id, screen_name: user.screen_name }, parse_tweets(tweets), botometer_res)
  }

  return ret
}

/**
 * Private function to calculate new tweets.
 */

function calculate_new_tweets(a, b) {
  const onlyInA = a.filter(comparer(b))
  const onlyInB = b.filter(comparer(a))
  return onlyInA.concat(onlyInB).length
}

/**
 * Private function to parse out tweets.
 */

function parse_tweets(tweets) {
  return tweets.map(function(tweet) {
    return { id: tweet.id, created_at: tweet.created_at }
  })
}

/**
 * Return difference between arrays.
 */

function comparer(otherArray){
  return function(current){
    return otherArray.filter(function(other){
      return other.value == current.value && other.display == current.display
    }).length == 0;
  }
}

