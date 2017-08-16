/* @flow */
const NotifmeSdk = require('notifme-sdk').default
const rabbitMq = require('../src').default // notifme-sdk-queue-rabbitmq

const notifmeSdk = new NotifmeSdk({
  requestQueue: rabbitMq('amqp://localhost'),
  runWorker: false,
  channels: {
    email: {
      providers: [{type: 'logger'}]
    }
  },
  onError: function (result, request) {
    if (result.errors && result.errors.queue) {
      /*
       * Queue system is down! Decide what to do in this case. You can either:
       * - Send notifications with this instance (code below)
       * - Use an alternative queue system (and run a worker corresponding to the queue)
       * - (To simply retry later, pass `keepRequestsInMemoryWhileConnecting: true` in the options)
       */
      notifmeSdk.sender.send(request) // providers need to be defined in NotifmeSdk options
    }
    // Also handle provider errors...
  }
})

function sendTestEmail () {
  notifmeSdk.send({
    email: {
      from: 'me@example.com',
      to: 'john@example.com',
      subject: 'Hi John',
      html: '<b>Hello John! How are you?</b>'
    }
  }).then(console.log)
}

// Enqueue the notifications
setInterval(sendTestEmail, 2000)
