declare module '@tmware/status-rotate' {
  import { ActivityOptions, Client as DJSClient, Presence } from 'discord.js'

  class StatusUpdater<ClientType extends DJSClient = DJSClient> {
    statusUrl?: string
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
    constructor (client: ClientType, statuses?: ActivityOptions[] | string)
    /**
     * Start automatically switching the client user's status
     * @param {Number} delay time between status updates in milliseconds
     */
    start (delay: number): void
    /**
     * Stop automatically switching the client user's status
     */
    stop (): void
    /**
     * Re-fetch status details from online url
     * THIS WILL OVERRIDE CURRENT DATA BY DEFAULT
     * @param {Boolean} additive add new data to current via Array.push()
     * @returns {Promise<ActivityOptions[]>}
     */
    refetchOnlineData (additive?: boolean): Promise<ActivityOptions[]>
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
    setStatusFileUrl (url: string): StatusUpdater
    /**
     * Update the variables the StatusUpdater can parse.
     * @param {Object} data Data as an object
     * @see https://github.com/TMWare/variable-parser
     * @example
     * updateParserData({ someName: "something" })
     */
    updateParserData (data: any): Object
    /**
     * Add a status to the possible statuses
     * @param {ActivityOptions} status ActivityOptions
     */
    addStatus (status: ActivityOptions): ActivityOptions[]
    /**
     * An array of possible status messages (as ActivityOptions)
     * @type ActivityOptions[]
     */
    get statuses (): ActivityOptions[]
    /**
     * Trigger a status update
     * @returns {Promise<Presence>}
     */
    updateStatus (activity?: ActivityOptions, shardId?: number): Promise<Presence>
  }
  export default StatusUpdater
}
