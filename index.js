
/**
 * Module dependencies.
 */

require('dotenv').config()
const { router, get, post } = require('microrouter')
const db_account = require('./lib/db-account')
const botometer = require('./lib/botometer')
const twitter = require('./lib/twitter')
const { send, json } = require('micro')
const Raven = require('raven')
const hex_sha1 = require('./lib/sha1.js').hex_sha1
const Analytics = require('analytics-node')
const analytics = new Analytics('aO23Wx83MZQnaPWyRvxffagdSm9I302w')
Raven.config(process.env.SENTRY_SECRET_URL, { captureUnhandledRejections: true }).install();

/**
 * Index.
 */

const index = (req, res) =>
  send(res, 200, 'Hello, world')

/**
 * Auth.
 */

const auth = (req, res) =>
  send(res, 200, 'Authorized.')

/**
 * Get score for user id and screen name.
 */

const get_score = async (req, res) => {
  if (!req.headers['x-twitter-oauth-token'] || !req.headers['x-twitter-oauth-secret']) send(res, 401, 'Twitter not authenticated')
  const auth = { oauth_token: req.headers['x-twitter-oauth-token'], oauth_token_secret: req.headers['x-twitter-oauth-secret'] }
  const body = await json(req)
  if (!body || !body.user_id || !body.screen_name) send(res, 400, 'Invalid user')
  body.user_id = '' + body.user_id
  if (req.headers['x-twitter-user-id']) analytics.track({ userId: hex_sha1(req.headers['x-twitter-user-id']), event: 'Account Checked' })
  const account = await db_account.get(body.user_id)
  let score = account
  try {
    if (!account) {
      const tweets = await twitter.get_tweets(body.user_id, auth)
      const mentions = await twitter.get_mentions(body.screen_name, auth)
      const botometer_res = await botometer.check_account({ id: body.user_id, screen_name: body.screen_name }, tweets, mentions)
      score = await db_account.upsert(body.user_id, { user_id: body.user_id, screen_name: body.screen_name, categories: botometer_res.categories, scores: botometer_res.scores })
    }
    send(res, 200, score)
  } catch(e) {
    send(res, 400, e)
  }
}

/**
 * Routes.
 */

module.exports = router(
  post('/api/', get_score),
  get('/auth/', auth),
  get('/', index)
)
