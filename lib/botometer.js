
/**
 * Module dependencies.
 */

const request = require('request-promise-native')
const botometer_key = process.env.BOTOMETER_KEY

/**
 * Check account.
 */

exports.check_account = async function check_account(user, timeline, mentions) {
  const options = {
    method: 'POST',
    uri: 'https://osome-botometer.p.mashape.com/2/check_account',
    body: {
      user: user,
      timeline: timeline,
      mentions: mentions
    },
    headers: {
      'X-Mashape-Key': botometer_key
    },
    json: true
  }
  return await request(options)
}
