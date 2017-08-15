/* @flow */
const NotifmeWorker = require('notifme-sdk/lib/worker').default
const rabbitMq = require('..').default // notifme-sdk-queue-rabbitmq

const notifmeWorker = new NotifmeWorker({
  requestQueue: rabbitMq('amqp://localhost'),
  channels: {
    email: {
      providers: [{type: 'logger'}]
    }
  }
})

// Dequeue and send the notifications
notifmeWorker.run()
