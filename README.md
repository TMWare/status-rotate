# Status Rotate

<div>
  <p align="center">
    <a href="https://www.npmjs.com/package/@tmware/status-rotate">
      <img src="https://img.shields.io/npm/v/@tmware/status-rotate?style=flat" />
    </a>
    <a href="https://github.com/tmware/status-rotate/actions">
      <img src="https://github.com/tmware/status-rotate/workflows/Build/badge.svg" />
    </a>
    <a href="https://www.npmjs.com/package/@tmware/status-rotate">
      <img src="https://img.shields.io/npm/dt/@tmware/status-rotate" />
    </a>
    <a href="https://tmuniversal.eu/redirect/patreon">
      <img src="https://img.shields.io/badge/Patreon-support_me-fa6956.svg?style=flat&logo=patreon" />
    </a>
    <br />
    <a href="https://bundlephobia.com/result?p=@tmware/status-rotate">
      <img src="https://img.shields.io/bundlephobia/min/@tmware/status-rotate?label=packge%20size" />
    </a>
    <a href="https://github.com/tmware/status-rotate/issues">
      <img src="https://img.shields.io/github/issues/tmware/status-rotate.svg?style=flat">
    </a>
    <a href="https://github.com/tmware/status-rotate/graphs/contributors">
      <img src="https://img.shields.io/github/contributors/tmware/status-rotate.svg?style=flat">
    </a>
    <a href="https://github.com/tmware/status-rotate/blob/stable/LICENSE.md">
      <img src="https://img.shields.io/github/license/tmware/status-rotate.svg?style=flat">
    </a>
  </p>
</div>

[Status Rotate] lets you manage the presence status of your Discord Bot easily.
Supports any [discord.js] based bots, including [discord-akairo] or [discord.js-commando](https://www.npmjs.com/package/discord.js-commando).

## Features

- [x] Customize selection of status messages/activities ([details](#passing-status-messages))
- [x] Variable support (i.e. show how many servers your bot has) ([details](#using-variables))
- [x] Web-based status message lists ([details](#web-based-status-messages))
- [x] Periodically update the status ([details](#automating-status-updates))

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Creating an instance of the status rotator:](#creating-an-instance-of-the-status-rotator)
    - [Passing status messages](#passing-status-messages)
    - [Actually using the Rotator](#actually-using-the-rotator)
- [More advanced examples](#more-advanced-examples)
  - [Automating Status Updates](#automating-status-updates)
  - [Using Variables](#using-variables)
    - [What you need to know](#what-you-need-to-know)
    - [Defining and updating variables:](#defining-and-updating-variables)
  - [Web-based status messages](#web-based-status-messages)
- [Author](#author)
- [Contributing](#contributing)
- [Show your support](#show-your-support)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting Started

### Installation

With npm: `npm install --save @tmware/status-rotate`

With yarn: `yarn add @tmware/status-rotate`

### Usage

Q: Help, I don't want to read all this, can you show me how this looks in code?

A: [Yes](https://github.com/TMUniversal/Emoji-Stealer/blob/master/src/client/BotClient.ts). See lines [81 and 82](https://github.com/TMUniversal/Emoji-Stealer/blob/master/src/client/BotClient.ts#L81), [141](https://github.com/TMUniversal/Emoji-Stealer/blob/master/src/client/BotClient.ts#L141)

#### Creating an instance of the status rotator:

```js
const { Client } = require('discord.js')

const StatusUpdater = require('@tmware/status-rotate')

const bot = new Client({
  /* client options... */
})

const Updater = new StatusUpdater(bot)
```

You can of course attach the rotator to your Discord client

```js
bot.statusUpdater = new StatusUpdater(bot)
```

#### Passing status messages

You can pass an array of possible status messages when creating the rotator,

```js
const statusMessages = [
  { type: 'PLAYING', name: 'with my banhammer' },
  { type: 'LISTENING', name: 'you' }
]

const Updater = new StatusUpdater(bot, statusMessages)
```

or you can add single messages afterwards

```js
Updater.addStatus({ type: 'PLAYING', name: 'in the sandbox' })
```

#### Actually using the Rotator

You now know a bit about adding status messages (more on custom variables and online status files later), here's how to actually use them.

```js
Updater.updateStatus()
```

Will choose, at random, one of the statuses that are available (the ones you added on initializing and with `.addStatus()`) and apply it.

If you want to set a specific status that isn't random, you can use

```js
Updater.updateStatus({
  type: 'WATCHING',
  name: 'a sports game.'
}) /* optionally, you can append a shard id */
```

## More advanced examples

The section above only featured some very basic things [status rotate] can do. In the following you will learn how to automate status updates (update every `n` minutes) and how you can use values like your bot's guild count in these status messages.

### Automating Status Updates

If you want to have such an update done every once in a while, for example every 10 minutes, use the `.start()` method

```js
Updater.start(10 * 60 * 1000) // Delay of 10 minutes in milliseconds
```

This will set up an interval of the given delay (ten minutes in this case).

Use `.stop()` to stop the automatic updates:

```js
Updater.stop()
```

This will clear the interval.

If you aren't satisfied with the level of control this gives you, you can adapt the behaviour below to your needs

```js
bot.setInterval(
  () => Updater.updateStatus(),
  10 * 60 * 1000
) /* the second argument is the time in milliseconds */
```

This can be combined with the event emitter

```js
// Listen for an event 'updateStatus', update the status when it occurs
bot.on('updateStatus', () => Updater.updateStatus())

// Every 10 minutes, emit such an event
bot.setInterval(() => bot.emit('updateStatus'), 10 * 60000)
```

Note: This technique can be used to execute a status update when the bot becomes _ready_.

```js
bot.once('ready', () => {
  /* your other code ... */
  bot.emit('updateStatus')
})
```

### Using Variables

For now, you've only seen static status messages (i.e. they don't depend on some variable, like your bot's guild count), but this is the advanced section so we'll learn how to do that as well.

First, let's make a new Updater, that has only messages that depend on variables

```js
const statusMessages = [
  { type: 'PLAYING', name: 'with {users} users' },
  { type: 'LISTENING', name: '{users} users' },
  { type: 'WATCHING', name: 'over {users} users' },
  { type: 'PLAYING', name: 'in {guilds} servers' },
  { type: 'PLAYING', name: '{prefix}help for help' },
  { type: 'WATCHING', name: '{guilds} servers' }
]

const Updater = new StatusUpdater(bot, statusMessages)
```

For more information on the under-the-hood workings of variables, see [@tmware/variable-parser](https://www.npmjs.com/package/@tmware/variable-parser).

#### What you need to know

- Variables are identified (by default, yes you can change that), by strings in singular curly braces: `{someString}`
- Before a variable can be parsed (replaced by it's value), **you must define that variable**.

#### Defining and updating variables:

Updating and defining variables works exactly the same way. Using the `.updateParserData()` method, you pass an Object containing keys (which are the variable names) and values.
This will merge the existing data (by default no data), with the Object you passed, keeping all existing data and only adding or overwriting key-value pairs you defined.

```js
Updater.updateParserData({ key: 'value' })
```

Actually useful example: adding current data to your Updater

```js
Updater.updateParserData({
  users: bot.users.cache.size,
  guilds: bot.guilds.cache.size,
  channels: bot.channels.cache.size
})
```

Since these values are not updated automatically, you should implement such a routine (see Automating)

### Web-based status messages

If you want to keep your status messages out of your code, maybe you want to keep your code cleaner, or not produce so many changes just because you want to update your status messages, you can upload a `JSON` formatted file to the internet and have [status rotate] take care of the rest.

I recommend creating a `GitHub Gist`, but a file on Pastebin or similar will do just as well.

[Example file](https://gist.githubusercontent.com/TMUniversal/253bd3172c3002be3e15e1152dd31bd4/raw/exampleFile.json), so you can see how to format this.

Using this in your code: instead of an array of statuses, pass a url to the file when initializing the Updater

```js
const Updater = new StatusUpdater(
  bot,
  'https://gist.githubusercontent.com/TMUniversal/253bd3172c3002be3e15e1152dd31bd4/raw/exampleFile.json'
)
```

You may also pass a url after the `StatusUpdater` has been initialized

```js
Updater.setStatusFileUrl(
  'https://gist.githubusercontent.com/TMUniversal/253bd3172c3002be3e15e1152dd31bd4/raw/3c9a2eeb9a79c0b999942e761b11838acb71d89f/exampleFile.json'
)
```

Note that this will not fetch any data. The `.refetchOnlineData()` method is used to do this:

```js
Updater.refetchOnlineData()
```

Will (re-)fetch the previously given file, overriding the old data.

If you want the new data to be added to the old instead, supply a truthy `additive` argument (defaults to false)

```js
Updater.refetchOnlineData(true)
```

Lastly, `.setStatusFileUrl()` and `.refetchOnlineData()` can be chained together:

```js
Updater.setStatusFileUrl(
  'https://gist.githubusercontent.com/TMUniversal/253bd3172c3002be3e15e1152dd31bd4/raw/3c9a2eeb9a79c0b999942e761b11838acb71d89f/exampleFile.json'
).refetchOnlineData()
```

## Author

👤 **TMUniversal**

* Website: [tmuniversal.eu](https://tmuniversal.eu)
* Github: [@TMUniversal](https://github.com/TMUniversal)

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/TMWare/status-rotate/issues). You can also take a look at the [contributing guide](https://github.com/TMWare/status-rotate/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/tmuni">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## License

Copyright © 2020 - 2021 [TMUniversal](https://github.com/TMUniversal).<br />
This project is [MIT](https://github.com/TMWare/status-rotate/blob/master/LICENSE) licensed.

[status rotate]: https://github.com/TMWare/status-rotate
[discord.js]: https://www.npmjs.com/package/discord.js
[discord-akairo]: https://www.npmjs.com/package/discord-akairo
