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
import NotifmeSdk from 'notifme-sdk'
import rabbitMq from 'notifme-sdk-queue-rabbitmq'

const notifmeSdk = new NotifmeSdk({
  requestQueue: rabbitMq('amqp://localhost'),
  runWorker: true, // consumer will start on the same instance than producer
  channels: {
    sms: {
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

notifmeSdk
  .send({sms: {from: '+15000000000', to: '+15000000001', text: 'Hello, how are you?'}})
  .then(console.log)
```

## How to use

### Options

```javascript
new NotifmeSdk({
  requestQueue: rabbitMq('URL (Example: amqp://localhost)', {
    amqpOptions: ...,
    reconnectDelaySecond: ...,
    keepRequestsInMemoryWhileConnecting: ...
  }),
  ...
})
```

| Option name | Required | Type | Description |
| --- | --- | --- | --- |
| `amqpOptions` | `false` | `Object` | Connection options. See [amqplib documentation](http://www.squaremobius.net/amqp.node/channel_api.html#connect). |
| `reconnectDelaySecond` | `false` | `number` | <i>Default: `30`.</i><br>Time in second to wait between two reconnection tries. |
| `keepRequestsInMemoryWhileConnecting` | `false` | `boolean` | <i>Default: `false`.</i><br>Should the requests be kept in memory while queue is (re)connecting? If set to `true`, may cause memory overflow. |

See also [Notif.me documentation](https://github.com/notifme/notifme-sdk).

### Use workers to send notifications

Use `runWorker: false` in the configuration of Notif.me SDK.

```javascript
// Producer
const notifmeSdk = new NotifmeSdk({
  requestQueue: rabbitMq('amqp://localhost'),
  runWorker: false
})

notifmeSdk.send(...)
```

```javascript
// Consumer
import NotifmeWorker from 'notifme-sdk/lib/worker'

const notifmeWorker = new NotifmeWorker({
  requestQueue: rabbitMq('amqp://localhost'),
  channels: {
    email: {
      providers: [{type: 'logger'}]
    }
  }
})
notifmeWorker.run()
```

See a [working example](https://github.com/notifme/notifme-sdk-queue-rabbitmq/tree/master/example) for more details.

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
