
/**
 * Module dependencies.
 */

const Twitter = require('twitter')

/**
 * Get tweets.
 */

exports.get_tweets = function get_tweets(user_id, auth) {
  return new Promise(
    function(resolve, reject) {
      create_client(auth).get('statuses/user_timeline', { user_id: user_id, count: 200 }, function(err, res) {
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

exports.get_mentions = function get_mentions(screen_name, auth) {
  return new Promise(
    function(resolve, reject) {
      create_client(auth).get('search/tweets', { q: '@' + screen_name, count: 100 }, function(err, res) {
        if (err)
          reject(err)
        else
          resolve(res.statuses)
      });
    }
  )
}

/**
 * Private function to create twitter client.
 */

function create_client(auth) {
  return new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: auth.oauth_token,
    access_token_secret: auth.oauth_token_secret
  })
}
