const API_ENDPOINT = "http://localhost:8090";

export interface IPlayerSummary {
    steamid: string;
    communityvisibilitystate: number;
    profilestate: number;
    personaname: string;
    lastlogoff: number;
    profileurl: string;
    avatar: string;
    avatarmedium: string;
    avatarfull: string;
    personastate: number;
    realname: string;
    primaryclanid: string;
    timecreated: number;
    personastateflags: number;
}

export interface IPlayerSummaries {
    response: {
        players: IPlayerSummary[]
    }
}

export interface IPlayerBan {
    SteamId: string;
    CommunityBanned: boolean;
    VACBanned: boolean;
    NumberOfVACBans: number;
    DaysSinceLastBan: number;
    NumberOfGameBans: number;
    EconomyBan: string;
}

export interface IPlayerBans {
    players: IPlayerBan[];
}

export default class SteamApi {
    public getPlayerSummaries(ids: string[]): Promise<IPlayerSummaries> {
        if (ids.length === 0) {
            return Promise.resolve({ response: { players: [] } });
        }
        const apiUrl = `${API_ENDPOINT}/getPlayerSummaries?steamids=${ids.join(",")}`;
        return fetch(apiUrl).then(res => res.json());
    }

    public getPlayerBans(ids: string[]): Promise<IPlayerBans> {
        if (ids.length === 0) {
            return Promise.resolve({ players: [] });
        }
        const apiUrl = `${API_ENDPOINT}/getPlayerBans?steamids=${ids.join(",")}`
        return fetch(apiUrl).then(res => res.json());
    }
}