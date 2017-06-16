
/**
 * Module dependencies.
 */

const account = require('./db').account

/**
 * Upsert twitter handle.
 */

exports.upsert = async function upsert(user_id, object) {
  return await account.findOneAndUpdate({ user_id: user_id }, object, { upsert: true, new: true })
};

/**
 * Get account.
 */

exports.get = async function get(user_id) {
  return await account.findOne({ user_id: user_id })
}
