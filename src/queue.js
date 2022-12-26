/* @flow */
import amqplib from 'amqplib'

export type QueueOptionsType = {
  url?: string,
  amqpOptions?: Object,
  queueName?: string,
  isPersistent?: boolean,
  reconnectDelaySecond?: number
}

export type ChannelType = {
  assertQueue: Function,
  prefetch: Function,
  consume: Function,
  ack: Function,
  sendToQueue: Function
}

const defaultOptions: QueueOptionsType = {
  url: 'amqp://localhost',
  amqpOptions: {},
  queueName: 'notifme:request',
  isPersistent: true,
  reconnectDelaySecond: 30
}

export default class RabbitMqQueue {
  options: QueueOptionsType
  connecting: boolean = true
  channelPromise: Promise<ChannelType>
  consumers: {[queueName: string]: Function[]} = {}

  constructor (options?: QueueOptionsType = {}) {
    this.options = {...defaultOptions, ...options}
    this.channelPromise = this.connect()
  }

  async connect (): Promise<ChannelType> {
    const {url, amqpOptions, reconnectDelaySecond} = this.options
    try {
      const connection = await amqplib.connect(url, amqpOptions)

      let connectionRestoring = true;
      connection.on('error', () => {
        if (connectionRestoring) {
          connectionRestoring = false
          this.reconnect()
        }
      })
      connection.on('close', () => {
        if (connectionRestoring){
          connectionRestoring = false
          this.reconnect()
        }
      })

      console.log('[RabbitMQ] Connection successful.')
      this.connecting = false
      return connection.createChannel()
    } catch (error) {
      console.error(`[RabbitMQ] Connection error. Retry in ${String(reconnectDelaySecond)} seconds.`)
      await sleep((reconnectDelaySecond: any))
      return this.connect()
    }
  }

  async reconnect () {
    this.connecting = true
    this.channelPromise = this.connect()
    await this.channelPromise
    Object.keys(this.consumers).forEach((queueName) => {
      this.consumers[queueName].forEach((consumer) => {
        this.consume(queueName, consumer)
      })
    })
  }

  async consume (queueName: string, callback: Function) {
    const {isPersistent} = this.options
    const channel = await this.channelPromise
    await channel.assertQueue(queueName, {durable: isPersistent})
    await channel.prefetch(1)
    return channel.consume(queueName, async (message) => {
      if (message !== null) {
        await callback(JSON.parse(message.content.toString()))
        channel.ack(message)
      }
    }, {noAck: !isPersistent})
  }

  async registerConsumer (callback: Function) {
    const {queueName}: any = this.options
    if (!this.consumers[queueName]) {
      this.consumers[queueName] = []
    }
    this.consumers[queueName].push(callback)
    return this.consume(queueName, callback)
  }

  async sendToQueue (request: Object) {
    const {queueName, isPersistent} = this.options
    const channel = await this.channelPromise
    await channel.assertQueue(queueName, {durable: isPersistent})
    return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(request)), {persistent: isPersistent})
  }
}

function sleep (second: number): Promise<void> {
  return new Promise((resolve: Function): any => setTimeout(resolve, second * 1000))
}
