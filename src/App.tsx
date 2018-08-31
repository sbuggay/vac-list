import * as React from 'react';

import Input from "./Input";
import { Legend } from './Legend';
import SteamApi, { IPlayerBan, IPlayerSummary } from "./steam/SteamApi";


export function bind(target: object, propertyKey: string, descriptor: any): any | void {
    if (!descriptor || (typeof descriptor.value !== "function")) {
        throw new TypeError(`Only methods can be decorated with @bind. <${propertyKey}> is not a method!`);
    }

    return {
        configurable: true,
        get(this) {
            const bound = descriptor.value!.bind(this);
            // Credits to https://github.com/andreypopp/autobind-decorator for memoizing the result of bind against a symbol on the instance.
            Object.defineProperty(this, propertyKey, {
                configurable: true,
                value: bound,
                writable: true
            });
            return bound;
        }
    };
}

interface IVacList {
    ids: string[];
    players: IPlayerBan[];
    summaries: { [key: string]: IPlayerSummary }
}

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
                const date = new Date(0);
                date.setUTCSeconds(playerSummary.timecreated)
                return (
                    <tr key={index}>
                        <td>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img src={playerSummary.avatar} />
                                <a href={playerSummary.profileurl}>
                                    {playerSummary.personaname}
                                </a>
                            </div>
                        </td>
                        <td>{date.toDateString()}</td>
                        <td>
                            <i className="fas fa-gamepad" style={{color: player.CommunityBanned ? "white" : "gray"}} />
                            <i className="fas fa-shield-alt" style={{color: player.VACBanned ? "white" : "gray"}} />
                            <i className="far fa-handshake" style={{color: player.EconomyBan !== "none" ? "white" : "gray"}} />
                        </td>

                    </tr>
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
                        <Input handleSubmit={this.handleSubmit} />
                        <div>
                            <button onClick={this.handleResolve}>Resolve</button>
                            <button onClick={this.handleImport}>Import</button>
                            <button onClick={this.handleExport}>Export</button>
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
            console.log(json);
            this.setState(Object.assign(state, {
                players: json.players
            }));
        });
    }

    // Handlers

    @bind
    private handleImport() {
        alert(JSON.stringify(this.state));
    }

    @bind
    private handleExport() {
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

            localStorage.setItem("vaclist", JSON.stringify(state));

            this.setState(state);
        });
    }

    @bind
    private handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const submittedId = (e.target as any).id.value;

        if (!submittedId) {
            return false;
        }

        const ids = this.state.ids.slice();

        ids.push(submittedId);

        this.setState({
            ids,
            players: this.state.players,
            summaries: this.state.summaries
        });

        localStorage.setItem("vaclist", JSON.stringify(this.state));

        return false;
    }
}

export default VacList;
