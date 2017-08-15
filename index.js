const amqplib = require('amqplib')

const defaultOptions = {
  reconnectDelaySecond: 30,
  keepRequestsInMemoryWhileConnecting: false // /!\ if true, may cause memory overflow
}

function NotifmeRabbitMq (url, options) {
  const mergedOptions = Object.assign({}, defaultOptions, options)
  const reconnectDelay = mergedOptions.reconnectDelaySecond

  let connecting = true

  function connect () {
    return amqplib.connect(url)
      .then(function (connection) {
        connection.on('error', reconnect)
        connection.on('close', reconnect)

        console.log('[RabbitMQ] Connection successful.')
        connecting = false
        return connection.createChannel()
      })
      .catch(function () {
        return new Promise(function (resolve) {
          console.error(`[RabbitMQ] Connection error. Retry in ${reconnectDelay} seconds.`)
          setTimeout(function () { resolve(connect()) }, reconnectDelay * 1000)
        })
      })
  }

  function reconnect () {
    connecting = true
    channelPromise = connect()
    channelPromise.then(function (channel) {
      Object.keys(consumers).forEach(function (type) {
        consumers[type].forEach(function (consumer) {
          addConsumer(type, consumer)
        })
      })
    })
  }

  let channelPromise = connect()
  let consumers = {}

  function addConsumer (type, callback) {
    return channelPromise.then(function (channel) {
      return channel.assertQueue(type, {durable: true}).then(function () {
        channel.prefetch(1)
        return channel.consume(type, function (message) {
          if (message !== null) {
            callback(JSON.parse(message.content.toString())).then(function () {
              channel.ack(message)
            })
          }
        }, {noAck: false})
      })
    })
  }

  return {
    enqueue: (type, request) => {
      return (connecting && !mergedOptions.keepRequestsInMemoryWhileConnecting)
        ? Promise.reject(new Error('[RabbitMQ] Queue is not ready yet. Please retry later.'))
        : channelPromise.then(function (channel) {
          return channel.assertQueue(type, {durable: true}).then(function () {
            return channel.sendToQueue(type, Buffer.from(JSON.stringify(request)), {persistent: true})
          })
        })
    },
    dequeue: (type, callback) => {
      if (!consumers[type]) {
        consumers[type] = []
      }
      consumers[type].push(callback)
      return addConsumer(type, callback)
    }
  }
}

exports.default = NotifmeRabbitMq
