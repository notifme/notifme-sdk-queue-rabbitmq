/* @flow */
import {NotifmeRabbitMqProducer} from '../src' // notifme-sdk-queue-rabbitmq

const notificationService = new NotifmeRabbitMqProducer({
  url: 'amqp://localhost'
})

const notificationRequest = {
  email: {
    from: 'me@example.com',
    to: 'john@example.com',
    subject: 'Hi John',
    html: '<b>Hello John! How are you?</b>'
  }
}

async function sendTestEmail () {
  try {
    await notificationService.enqueueNotification(notificationRequest)
    console.log('queued')
  } catch (error) {
    /*
     * Queue system is down!
     *
     * Decide what to do in this case (while queue tries to reconnect). You can either:
     * 1. Send notifications with this instance:
     *      new notifmeSdk({your providers' options...}).send(notificationRequest)
     * 2. Use an alternative queue system (and run a worker corresponding to the queue)
     * 3. (To simply keep request in memory and retry later, pass `keepRequestsInMemoryWhileConnecting: true`
     *    in the NotifmeRabbitMqProducer options and no error will be raised)
     */
    console.error(error)
  }
}

// Enqueue the notifications
setInterval(sendTestEmail, 2000)
