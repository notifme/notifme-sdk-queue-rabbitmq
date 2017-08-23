/* @flow */
import RabbitMqQueue from './queue'
// Types
import type {NotificationRequestType} from 'notifme-sdk'
import type {QueueOptionsType} from './queue'

export type ConsumerOptionsType = QueueOptionsType

export default class NotifmeRabbitMqConsumer {
  queue: RabbitMqQueue

  constructor (options?: ConsumerOptionsType = {}) {
    this.queue = new RabbitMqQueue(options)
  }

  run (consumer: (NotificationRequestType) => any) {
    this.queue.registerConsumer(consumer)
  }
}
