/* @flow */
import NotifmeSdk from 'notifme-sdk'
import NotifmeRabbitMqConsumer from '../src/consumer' // notifme-sdk-queue-rabbitmq/lib/consumer

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

const notifmeWorker = new NotifmeRabbitMqConsumer(notifmeSdk, {
  url: 'amqp://localhost'
})
notifmeWorker.run()
