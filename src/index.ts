import { ActivityOptions, Client as DJSClient, Presence } from 'discord.js'
import { AkairoClient } from 'discord-akairo'
import Util from '@tmware/jitsuyo'
import VariableParser from '@tmware/variable-parser'
import Axios from 'axios'

const defaultStatuses: Array<ActivityOptions> = [
  { type: 'PLAYING', name: 'with {users} users' },
  { type: 'LISTENING', name: '{users} users' },
  { type: 'WATCHING', name: 'over {users} users' },
  { type: 'PLAYING', name: 'in {guilds} servers' },
  { type: 'PLAYING', name: '{prefix}help for help' },
  { type: 'WATCHING', name: '{guilds} servers' }
]

export type DiscordClient = AkairoClient | DJSClient

export default class StatusUpdater {
  private client: DiscordClient
  private parser: VariableParser
  public statusUrl?: string
  private _statuses: ActivityOptions[]
  private isReady: boolean
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
        if (!Util.validators.isUrl(statuses)) { throw new Error('Invalid statuses URL') }
        this.statusUrl = statuses
      } else if (Array.isArray(statuses)) this._statuses = statuses
      else throw new Error('Invalid status options.')
    }

    this.isReady = false

    this._init()
  }

  private async _init () {
    this._getStatuses().then(() => {
      this.isReady = true
    })
  }

  /**
   * Try to download the latest ActivityOptions data.
   */
  private async _getStatuses (): Promise<ActivityOptions[]> {
    if (this.statusUrl) {
      const statuses = await Axios.get(this.statusUrl)
      this._statuses = statuses.data
      return this._statuses
    } else {
      return defaultStatuses
    }
  }

  /**
   * Update the variable parser with the latest data from the client.
   */
  private _updateParserData () {
    this.parser.updateData({
      users: this.client.users.cache.size,
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
  public updateParserData (data): Object {
    return this.parser.updateData(data)
  }

  /**
   * Add a status to the possible statuses
   * @param {ActivityOptions} status ActivityOptions
   */
  public addStatus (status: ActivityOptions) {
    if (!this.isReady) { return Promise.reject(new Error('StatusUpdater is not ready.')) }
    if (!this._statuses.includes(status)) {
      this._statuses.push(status)
      return Promise.resolve(this.statuses)
    } else {
      return Promise.reject(new Error('Already included.'))
    }
  }

  /**
   * An array of possible status messages (as ActivityOptions)
   * @type ActivityOptions[]
   */
  public get statuses (): ActivityOptions[] {
    // If the status download isn't done yet, serve the default statuses instead.
    if (!this.isReady) return defaultStatuses
    return this._statuses
  }

  /**
   * Trigger a status update
   * @returns {Promise<Presence>}
   */
  public updateStatus (
    activity?: ActivityOptions,
    shardId?: number
  ): Promise<Presence> {
    this._updateParserData()
    const $activity = this.getSafeActivity(activity) || this._chooseActivity()
    if (shardId) $activity.shardID = shardId
    return this.client.user.setActivity($activity)
  }

  private _chooseActivity (): ActivityOptions {
    return this.getSafeActivity(
      this.statuses[~~(Math.random() * this.statuses.length)]
    )
  }

  private getSafeActivity = (info: ActivityOptions): ActivityOptions => {
    if (!info) return
    return {
      ...info,
      type: info.type || 'PLAYING',
      name: this.parser.parse(info.name) || 'a game'
    }
  }
}

module.exports = StatusUpdater
