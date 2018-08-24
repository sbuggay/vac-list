const API_ENDPOINT = "localhost:8090";

export default class SteamApi {
    public getPlayerSummaries(ids: string[]) {
        if (ids.length === 0) {
            return Promise.resolve({});
        }
        const apiUrl = `${API_ENDPOINT}/getPlayerSummaries?steamids=${ids.join(",")}`;
        return fetch(apiUrl).then(res => res.json());
    }

    public getPlayerBans(ids: string[]) {
        if (ids.length === 0) {
            return Promise.resolve({});
        }
        const apiUrl = `${API_ENDPOINT}/getPlayerBans?steamids=${ids.join(",")}`
        return fetch(apiUrl).then(res => res.json());
    }
}