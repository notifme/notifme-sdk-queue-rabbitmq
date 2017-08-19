/* @flow */

export function getNotifmeConsumer () {
  return require('./consumer').default
}

export function getNotifmeProducer () {
  return require('./producer').default
}
