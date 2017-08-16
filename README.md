<p align="center">
  <a href="https://www.notif.me">
    <img alt="Notif.me" src="https://notifme.github.io/notifme-sdk/img/logo.png" />
  </a>
</p>

<p align="center">
  RabbitMQ plugin for <a href="https://github.com/notifme/notifme-sdk">Notif.me SDK</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/notifme-sdk-queue-rabbitmq"><img alt="npm-status" src="https://img.shields.io/npm/v/notifme-sdk-queue-rabbitmq.svg?style=flat" /></a>
  <a href="https://github.com/notifme/notifme-sdk-queue-rabbitmq/blob/master/LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT_License-blue.svg?style=flat" /></a>
</p>

- [Features](#features)
- [Getting started](#getting-started)
- [How to use](#how-to-use)
- [Contributing](#contributing)
- [Need help? Found a bug?](#need-help-found-a-bug)

## Features

* **Easy integration** — Just plug and play.

* **Breakdown management** — Try to reconnect automatically if connection to queue is lost, and let you choose what to do with notification requests in the meantime.

* **MIT license** — Use it like you want.

## Getting Started

```shell
$ yarn add notifme-sdk notifme-sdk-queue-rabbitmq
```

```javascript
// In your application
import {NotifmeRabbitMqProducer} from 'notifme-sdk-queue-rabbitmq'

const notificationService = new NotifmeRabbitMqProducer({
  url: 'amqp://localhost'
})

notificationService.enqueueNotification({
  sms: {from: '+15000000000', to: '+15000000001', text: 'Hello, how are you?'}
})
```

```javascript
// In your worker
import NotifmeSdk from 'notifme-sdk'
import {NotifmeRabbitMqConsumer} from 'notifme-sdk-queue-rabbitmq'

const notifmeSdk = new NotifmeSdk({
  // Define all your providers here.
  // (see documentation: https://github.com/notifme/notifme-sdk#2-providers)
})

const notifmeWorker = new NotifmeRabbitMqConsumer(notifmeSdk, {
  url: 'amqp://localhost'
})
notifmeWorker.run()

```

See a [complete working example](https://github.com/notifme/notifme-sdk-queue-rabbitmq/tree/master/example) for more details.

## How to use

### Producer options

```javascript
new NotifmeRabbitMqProducer({
  keepRequestsInMemoryWhileConnecting: ...,
  url: ...,
  amqpOptions: ...,
  queueName: ...,
  isPersistent: ...,
  reconnectDelaySecond: ...
})
```

| Option name | Type | Default | Description |
| --- | --- | --- | --- |
| `keepRequestsInMemoryWhileConnecting` | `boolean` | `false` | Should the requests be kept in memory while queue is (re)connecting? If set to `true`, may cause memory overflow. |
| `url` | `string` | `'amqp://localhost'` | RabbitMQ URL. See [amqplib documentation](http://www.squaremobius.net/amqp.node/channel_api.html#connect). |
| `amqpOptions` | `Object` | `{}` | Connection options. See [amqplib documentation](http://www.squaremobius.net/amqp.node/channel_api.html#connect). |
| `queueName` | `string` | `'notifme:request'` | Name of the queue to use. |
| `isPersistent` | `boolean` | `true` | Is the queue persistent? |
| `reconnectDelaySecond` | `number` | `30` | Time in second to wait between two reconnection tries. |

### Consumer options

```javascript
new NotifmeRabbitMqConsumer({
  url: ...,
  amqpOptions: ...,
  queueName: ...,
  isPersistent: ...,
  reconnectDelaySecond: ...
})
```

| Option name | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `string` | `'amqp://localhost'` | RabbitMQ URL. See [amqplib documentation](http://www.squaremobius.net/amqp.node/channel_api.html#connect). |
| `amqpOptions` | `Object` | `{}` | Connection options. See [amqplib documentation](http://www.squaremobius.net/amqp.node/channel_api.html#connect). |
| `queueName` | `string` | `'notifme:request'` | Name of the queue to use. |
| `isPersistent` | `boolean` | `true` | Is the queue persistent? |
| `reconnectDelaySecond` | `number` | `30` | Time in second to wait between two reconnection tries. |

## Contributing

Contributions are very welcome!

To get started: [fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device.

```shell
$ git clone git@github.com:[YOUR_USERNAME]/notifme-sdk-queue-rabbitmq.git && cd notifme-sdk-queue-rabbitmq
$ yarn install
```

## Need Help? Found a bug?

[Submit an issue](https://github.com/notifme/notifme-sdk-queue-rabbitmq/issues) to the project Github if you need any help.
And, of course, feel free to submit pull requests with bug fixes or changes.
