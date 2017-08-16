/* @flow */
import RabbitMqQueue from './queue'
// Types
import type {NotificationRequestType} from 'notifme-sdk'
import type {QueueOptionsType} from './queue'

export type ProducerOptionsType = {
  keepRequestsInMemoryWhileConnecting?: boolean,
} & QueueOptionsType

const defaultOptions: ProducerOptionsType = {
  keepRequestsInMemoryWhileConnecting: false // /!\ if set to true, may cause memory overflow
}

export default class NotifmeRabbitMqProducer {
  options: ProducerOptionsType
  queue: RabbitMqQueue

  constructor (options?: ProducerOptionsType = {}) {
    const {keepRequestsInMemoryWhileConnecting, ...queueOptions} = options
    this.options = {
      ...defaultOptions,
      ...(keepRequestsInMemoryWhileConnecting ? {keepRequestsInMemoryWhileConnecting} : null)
    }
    this.queue = new RabbitMqQueue({...queueOptions})
  }

  async enqueueNotification (request: NotificationRequestType): Promise<void> {
    const {keepRequestsInMemoryWhileConnecting} = this.options
    if (this.queue.connecting && !keepRequestsInMemoryWhileConnecting) {
      throw new Error('[RabbitMQ] Queue is not ready yet. Please retry later.')
    } else {
      await this.queue.sendToQueue(request)
    }
  }
}
