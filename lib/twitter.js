
/**
 * Module dependencies.
 */

const Twitter = require('twitter')

/**
 * Twitter client.
 */

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

/**
 * Get tweets.
 */

exports.get_tweets = function get_tweets(user_id) {
  return new Promise(
    function(resolve, reject) {
      client.get('statuses/user_timeline', { user_id: user_id, count: 200 }, function(err, res) {
        if (err)
          reject(err)
        else
          resolve(res)
      });
    }
  )
}

/**
 * Get mentions.
 */

exports.get_mentions = function get_mentions(screen_name) {
  return new Promise(
    function(resolve, reject) {
      client.get('search/tweets', { q: '@' + screen_name, count: 100 }, function(err, res) {
        if (err)
          reject(err)
        else
          resolve(res.statuses)
      });
    }
  )
}

