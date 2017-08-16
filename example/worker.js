/* @flow */
import NotifmeSdk from 'notifme-sdk'
import {NotifmeRabbitMqConsumer} from '../src' // notifme-sdk-queue-rabbitmq

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
