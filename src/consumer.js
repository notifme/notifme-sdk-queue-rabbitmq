/* @flow */
import RabbitMqQueue from './queue'
import NotifmeSdk from 'notifme-sdk'
// Types
import type {NotificationRequestType} from 'notifme-sdk'
import type {QueueOptionsType} from './queue'

export type ConsumerOptionsType = QueueOptionsType

export default class NotifmeRabbitMqConsumer {
  queue: RabbitMqQueue
  sender: NotifmeSdk

  constructor (notifmeSdk: NotifmeSdk, options?: ConsumerOptionsType = {}) {
    this.queue = new RabbitMqQueue(options)
    this.sender = notifmeSdk
  }

  run () {
    this.queue.registerConsumer(async (request: NotificationRequestType) => {
      await this.sender.send(request)
    })
  }
}
