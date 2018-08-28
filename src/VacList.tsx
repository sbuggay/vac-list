import * as React from 'react';

import Input from "./Input";
import SteamApi, { IPlayerBan, IPlayerSummary } from "./steam/SteamApi";

interface IVacList {
    players: IPlayerBan[];
    summaries: { [key: string]: IPlayerSummary }
}

class VacList extends React.Component<any, IVacList> {

    private steamApi: SteamApi;

    public constructor(props: any) {
        super(props);

        this.steamApi = new SteamApi();

        this.handleExport = this.handleExport.bind(this);
        this.handleResolve = this.handleResolve.bind(this);

        this.state = {
            players: [],
            summaries: {}
        }
    }

    public componentDidMount() {
        const ids = localStorage.getItem("vaclist");
        if (!ids) {
            return;
        }
        const parsedIds = JSON.parse(ids);
        this.steamApi.getPlayerBans(parsedIds).then(json => {
            this.setState({
                players: json.players,
                summaries: this.state.summaries
            });
        }).catch(e => {
            console.error(e);
        });
    }

    public handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let ids = localStorage.getItem("vaclist");
        if (!ids) {
            ids = JSON.stringify([]);
        }
        const parsedIds = JSON.parse(ids);
        const submittedId = (e.target as any).id.value;

        if (!submittedId) {
            return false;
        }

        parsedIds.push(submittedId);
        localStorage.setItem("vaclist", JSON.stringify(parsedIds));

        this.setState({
            players: parsedIds,
            summaries: this.state.summaries
        });

        return false;
    }

    public render() {
        const players = this.state.players;

        const playerElements = players.map((player, index) => {
            if (this.state.summaries[player.SteamId]) {
                const playerSummary = this.state.summaries[player.SteamId];
                return (
                    <tr key={index}>
                        <td><a href={`https://steamcommunity.com/profiles/${player.SteamId}`}>{playerSummary.personaname}</a></td>
                        <td>{player.CommunityBanned ? "true" : "false"}</td>
                        <td>{player.VACBanned ? "true" : "false"}</td>
                        <td>{player.EconomyBan}</td>
                    </tr>
                );
            }
            else {
                return (
                    <tr key={index}>
                        <td><a href={`https://steamcommunity.com/profiles/${player.SteamId}`}>{player.SteamId}</a></td>
                        <td>{player.CommunityBanned ? "true" : "false"}</td>
                        <td>{player.VACBanned ? "true" : "false"}</td>
                        <td>{player.EconomyBan}</td>
                    </tr>
                );
            }

        });

        let comBanned = 0;
        let vacBanned = 0;
        let ecoBanned = 0;

        players.forEach(player => {
            comBanned += player.CommunityBanned ? 1 : 0;
            vacBanned += player.VACBanned ? 1 : 0;
            ecoBanned += player.EconomyBan !== "none" ? 1 : 0;
        });

        return (
            <div>
                <div className="Header">
                    <Input handleSubmit={this.handleSubmit} />
                    <div>
                        <button onClick={this.handleResolve}>Resolve</button>
                        <button>Import</button>
                        <button onClick={this.handleExport}>Export</button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>SteamId</th>
                            <th>CommunityBanned ({comBanned})</th>
                            <th>VACBanned ({vacBanned})</th>
                            <th>EconomyBan ({ecoBanned})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerElements}
                    </tbody>
                </table>
            </div>
        );
    }

    private handleExport() {
        alert(JSON.stringify(this.state));
    }

    private handleResolve() {
        const steamids = this.state.players.map(player => player.SteamId);
        this.steamApi.getPlayerSummaries(steamids).then(response => {
            const summaries = {};
            response.response.players.forEach(player => {
                summaries[player.steamid] = player;
            });
            this.setState({
                players: this.state.players,
                summaries
            });
        });
    }
}

export default VacList;
