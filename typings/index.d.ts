import { ActivityOptions, Client as DJSClient, Presence } from 'discord.js';
import { AkairoClient } from 'discord-akairo';
export declare type DiscordClient = AkairoClient | DJSClient;
export default class StatusUpdater {
    private client;
    private parser;
    statusUrl?: string;
    private _statuses;
    private isReady;
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
    constructor(client: DiscordClient, statuses?: ActivityOptions[] | string);
    /**
     * Update the variables the StatusUpdater can parse.
     * @param {Object} data Data as an object
     * @see https://github.com/TMWare/variable-parser
     * @example
     * updateParserData({ someName: "something" })
     */
    updateParserData(data: any): Object;
    /**
     * Add a status to the possible statuses
     * @param {ActivityOptions} status ActivityOptions
     */
    addStatus(status: ActivityOptions): Promise<ActivityOptions[]>;
    /**
     * An array of possible status messages (as ActivityOptions)
     * @type ActivityOptions[]
     */
    get statuses(): ActivityOptions[];
    /**
     * Trigger a status update
     * @returns {Promise<Presence>}
     */
    updateStatus(activity?: ActivityOptions, shardId?: number): Promise<Presence>;
}
