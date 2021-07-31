/// <reference path="../typings/index.d.ts" />
'use strict'

import Util from '@tmware/jitsuyo'
import VariableParser, { VariableParserData } from '@tmware/variable-parser'
import Axios from 'axios'
import { AkairoClient } from 'discord-akairo'
import { ActivityOptions, Client as DJSClient, Presence } from 'discord.js'

const defaultStatuses: ActivityOptions[] = [
  { type: 'PLAYING', name: 'with {users} users' },
  { type: 'LISTENING', name: '{users} users' },
  { type: 'WATCHING', name: 'over {users} users' },
  { type: 'PLAYING', name: 'in {guilds} servers' },
  { type: 'WATCHING', name: '{guilds} servers' }
]

export type DiscordClient = AkairoClient | DJSClient

export default class StatusUpdater {
  private readonly client!: DiscordClient
  private readonly parser!: VariableParser
  public statusUrl?: string
  private _statuses!: ActivityOptions[]
  private isReady!: boolean
  // eslint-disable-next-line no-undef
  private timer!: NodeJS.Timeout | false
  /**
   * A status updater that can pull from the internet
   * @param {DiscordClient} client discord.js (extending) client
   * @param {Array<ActivityOptions> | String} statuses Either an array of ActivityOptions or a url to download such an array from.
   * @example const StatusUpdater = new StatusUpdater(client,
   * [
   *   { type: 'PLAYING', name: 'with {users} users'},
   *   { type: 'WATCHING', name: '{guilds} guilds'},
   *   ...
   * ])
   *
   * @example const StatusUpdater = new StatusUpdater(client, 'https://example.com/statuses.json')
   */
  constructor (client: DiscordClient, statuses?: ActivityOptions[] | string) {
    this.client = client
    this.parser = new VariableParser()
    if (statuses) {
      if (typeof statuses === 'string') {
        if (!Util.validators.isUrl(statuses)) {
          throw new Error('Invalid statuses URL')
        }
        this.statusUrl = statuses
      }

      else if (Array.isArray(statuses)) {
        this._statuses = statuses
      }

      else {
        throw new Error('Invalid status options.')
      }
    }

    this.isReady = false

    this._init()
  }

  private async _init (): Promise<void> {
    this._getStatuses().then(() => {
      this.isReady = true
    })
  }

  /**
   * Try to download the latest ActivityOptions data.
   */
  private async _getStatuses (): Promise<ActivityOptions[]> {
    if (this.statusUrl) {
      this._statuses = (await Axios.get(this.statusUrl)).data as ActivityOptions[]
      return this._statuses
    }
    else {
      return this._statuses || defaultStatuses
    }
  }

  /**
   * Start automatically switching the client user's status
   * @param {Number} delay time between status updates in milliseconds
   */
  public start (delay: number): void {
    if (this.timer !== false) {
      throw new Error('automatic status updates are already enabled')
    }
    this.timer = this.client.setInterval(
      () => {
        this.updateStatus()
      },
      delay,
      this
    )
  }

  /**
   * Stop automatically switching the client user's status
   */
  public stop (): void {
    if (this.timer === false) {
      throw new Error('automatic status updates are not enabled')
    }
    this.client.clearInterval(this.timer)
    this.timer = false
  }

  /**
   * Re-fetch status details from online url
   * THIS WILL OVERRIDE CURRENT DATA BY DEFAULT
   * @param {Boolean} additive add new data to current via Array.push()
   * @returns {Promise<ActivityOptions[]>}
   */
  public async refetchOnlineData (additive: boolean = false): Promise<ActivityOptions[]> {
    if (!this.statusUrl) throw new Error('no status url specified')
    else if (additive) {
      this._statuses.push(...((await Axios.get(this.statusUrl)).data as ActivityOptions[]))
      return this.statuses
    }
    else {
      this._statuses = (await Axios.get(this.statusUrl)).data as ActivityOptions[]
      return this.statuses
    }
  }

  /**
   * Define a url for a remote file
   * Should be formatted as seen [here](https://gist.githubusercontent.com/TMUniversal/253bd3172c3002be3e15e1152dd31bd4/raw/3c9a2eeb9a79c0b999942e761b11838acb71d89f/exampleFile.json)
   * You should run refetchOnlineData() to make use of the new file
   * @example StatusUpdater
   * .setStatusFileUrl("https://gist.githubusercontent.com/TMUniversal/253bd3172c3002be3e15e1152dd31bd4/raw/3c9a2eeb9a79c0b999942e761b11838acb71d89f/exampleFile.json")
   * .refetchOnlineData()
   *
   * @param {String} url
   * @returns {StatusUpdater} returns `this` so you can chain .refetchOnlineData()
   */
  public setStatusFileUrl (url: string): StatusUpdater {
    if (!Util.validators.isUrl(url)) {
      throw new Error('Invalid statuses URL')
    }
    this.statusUrl = url

    return this
  }

  /**
   * Update the variable parser with the latest data from the client.
   */
  private _updateParserData (): void {
    this.parser.updateData({
      users: this.client.users.cache.filter(u => !u.bot).size,
      guilds: this.client.guilds.cache.size,
      channels: this.client.channels.cache.size
    })
  }

  /**
   * Update the variables the StatusUpdater can parse.
   * @param {Object} data Data as an object
   * @see https://github.com/TMWare/variable-parser
   * @example
   * updateParserData({ someName: "something" })
   */
  public updateParserData (data: VariableParserData): Object {
    return this.parser.updateData(data)
  }

  /**
   * Add a status to the possible statuses
   * @param {ActivityOptions} status ActivityOptions
   */
  public async addStatus (status: ActivityOptions): Promise<ActivityOptions[]> {
    if (!this.isReady) {
      return await Promise.reject(new Error('StatusUpdater is not ready.'))
    }
    if (!this._statuses.includes(status)) {
      this._statuses.push(status)
      return await Promise.resolve(this.statuses)
    }
    else {
      return await Promise.reject(new Error('Already included.'))
    }
  }

  /**
   * An array of possible status messages (as ActivityOptions)
   * @type ActivityOptions[]
   */
  public get statuses (): ActivityOptions[] {
    // If the status download isn't done yet, serve the default statuses instead.
    return this._statuses || defaultStatuses
  }

  /**
   * Trigger a status update
   * @returns {Promise<Presence>}
   */
  public async updateStatus (activity?: ActivityOptions, shardId?: number): Promise<Presence> {
    if (!this.client.user) throw new Error('cannot update status of undefined client user')
    this._updateParserData()
    const $activity = activity ? this.getSafeActivity(activity) : this._chooseActivity()
    if (shardId) $activity.shardID = shardId
    return await this.client.user.setActivity($activity)
  }

  private _chooseActivity (): ActivityOptions {
    return this.getSafeActivity(Util.arrayHelper.pickRandom(this.statuses) as ActivityOptions)
  }

  private getSafeActivity (info: ActivityOptions): ActivityOptions {
    return {
      ...info,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      type: info.type || 'PLAYING',
      name: info.name ? this.parser.parse(info.name) : 'a game'
    }
  }
}

module.exports = StatusUpdater
