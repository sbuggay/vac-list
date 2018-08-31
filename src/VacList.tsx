import * as React from 'react';


import Input from "./Input";
import { Legend } from './Legend';
import { PlayerRow } from './PlayerRow';
import SteamApi, { IPlayerBan, IPlayerSummary } from "./steam/SteamApi";
import { bind } from "./utilities/utilities";

interface IVacList {
    ids: string[];
    players: IPlayerBan[];
    summaries: { [key: string]: IPlayerSummary }
}

/**
 * Driving smart component for the app.
 *
 * @class VacList
 * @extends {React.Component<any, IVacList>}
 */
class VacList extends React.Component<any, IVacList> {

    public constructor(props: any) {
        super(props);

        this.state = {
            ids: [],
            players: [],
            summaries: {}
        }
    }

    public componentDidMount() {
        this.getBanStatus();
    }

    public render() {
        const players = this.state.players;
        const playerElements = players.map((player, index) => {
            if (this.state.summaries[player.SteamId]) {
                const playerSummary = this.state.summaries[player.SteamId];
                return (
                    <PlayerRow ban={player} summary={playerSummary} key={index} />
                );
            }
            else {
                return (
                    <tr key={index}>
                        <td><a href={`https://steamcommunity.com/profiles/${player.SteamId}`}>{player.SteamId}</a></td>
                        <td>{player.CommunityBanned ? "true" : "false"}</td>
                        <td><i className="fas fa-shield-alt" /></td>
                    </tr>
                );
            }

        });

        return (
            <div className="App">
                <div>
                    <div className="Header">
                        <h2 style={{ margin: 0, marginRight: "20px" }}>VacList</h2>
                        <Input handleSubmit={this.handleSubmit} />
                        <div>
                            <button onClick={this.handleResolve}>Resolve</button>
                            <button onClick={this.handleImportExport}>Import / Export</button>
                        </div>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Profile</th>
                                <th>Created</th>
                                <th>Bans</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerElements}
                        </tbody>
                    </table>
                </div>
                <Legend />
            </div>
        );
    }

    private getBanStatus() {
        // refactor to generalized storage
        const vaclist = localStorage.getItem("vaclist");
        if (!vaclist) {
            return;
        }
        const state = JSON.parse(vaclist) as IVacList;
        SteamApi.getPlayerBans(state.ids).then(json => {
            // we want this to be in the same order as the id list
            const players = json.players;
            players.sort((a, b) => {
                return (state.ids.indexOf(a.SteamId) > state.ids.indexOf(b.SteamId)) ? 1 : -1;
            });
            this.setState(Object.assign(state, { players }));
        });
    }

    // Handlers

    @bind
    private handleImportExport() {
        alert(JSON.stringify(this.state));
    }

    @bind
    private handleResolve() {
        const steamids = this.state.players.map(player => player.SteamId);
        SteamApi.getPlayerSummaries(steamids).then(response => {
            const summaries = {};
            response.response.players.forEach(player => {
                summaries[player.steamid] = player;
            });

            const state: IVacList = {
                ids: this.state.ids,
                players: this.state.players,
                summaries
            }

            this.setState(state);
            // todo: refactor storage
            localStorage.setItem("vaclist", JSON.stringify(state));
        });
    }

    @bind
    private handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const submittedId = (e.target as any).id.value;

        if (!submittedId) {
            return;
        }

        this.state.ids.push(submittedId);
        this.setState(this.state);
        // todo: refactor storage
        localStorage.setItem("vaclist", JSON.stringify(this.state));
    }
}

export default VacList;
