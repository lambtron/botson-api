
/**
 * Module dependencies.
 */

require('dotenv').config()
const { router, get, post } = require('microrouter')
const { send, json } = require('micro')
const Raven = require('raven')
const score = require('./lib/score')
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
  if (req.headers['x-twitter-user-id']) analytics.track({ userId: req.headers['x-twitter-user-id'], event: 'Account Checked' })
  const auth = { oauth_token: req.headers['x-twitter-oauth-token'], oauth_token_secret: req.headers['x-twitter-oauth-secret'] }
  const body = await json(req)
  if (!body || !body.user_id || !body.screen_name) send(res, 400, 'Invalid user')
  body.user_id = '' + body.user_id
  let ret = await score.get(body, auth)
  send(res, 200, ret)
}

/**
 * Routes.
 */

module.exports = router(
  post('/api/', get_score),
  get('/auth/', auth),
  get('/', index)
)
