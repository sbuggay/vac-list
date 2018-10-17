import { IPlayerStatus, IPlayerSummary } from "../steam/SteamApi";

export interface IPlayers { [key: string]: {
    status?: IPlayerStatus;
    summary?: IPlayerSummary;
}};

export default class Storage {

    public players: IPlayers;

    constructor() {
        this.players = {};
    }

    public addPlayer(id: string) {
        this.players[id] = {};
    }

    public removePlayer(id: string) {
        delete this.players[id];
    }

    public updatePlayerStatus(id: string, status: IPlayerStatus) {
        if(!this.players[id]) {
            return;
        }
        this.players[id].status = status;
    }

    public updatePlayerSummary(id: string, summary: IPlayerSummary) {
        if(!this.players[id]) {
            return;
        }
        this.players[id].summary = summary;
    }
    
    public clearPlayer(id: string) {
        this.players[id] = {};
    }
}