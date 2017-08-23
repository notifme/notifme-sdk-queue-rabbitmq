/* @flow */
import NotifmeSdk from 'notifme-sdk'
import NotifmeRabbitMqConsumer from '../src/consumer' // notifme-sdk-queue-rabbitmq/lib/consumer
// Types
import type {NotificationRequestType} from 'notifme-sdk'

const notifmeSdk = new NotifmeSdk({
  channels: {
    /*
     * Define all your providers here.
     * (see documentation: https://github.com/notifme/notifme-sdk#2-providers)
     */
    email: {
      providers: [{type: 'logger'}]
    }
  }
})

const notifmeWorker = new NotifmeRabbitMqConsumer({
  url: 'amqp://localhost'
})

notifmeWorker.run(async (request: NotificationRequestType) => {
  const result = await notifmeSdk.send(request)
  if (result.status === 'error') {
    /*
     * Some channels of this request have errors.
     * Which means all your providers failed for these channels.
     * Do you want to retry failing channels by enqueing to a delayed queue?
     */
  }
})
