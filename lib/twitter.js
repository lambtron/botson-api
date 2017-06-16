
/**
 * Module dependencies.
 */

const Twitter = require('twitter')

/**
 * Twitter client.
 */

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY || 'ofP7dcRK5BVqqzX0MEpFI7a97',
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET || '5IVapFfZt31kP0CQL0d8U4zjkUlaHHGLaAe3rx2Lxc1eZMpNiM',
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY || '3629421-ZNo4Kk2MNCgerqmpOYN1r7fhEFj2K2XZDnPgiLJT6c',
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET || 'F089B02w095vjZA5aL4MfOyj4CDnyaZytfCGHF5oiagY1'
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

