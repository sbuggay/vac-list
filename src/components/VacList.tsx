import * as React from 'react';


import Input from "./Input";
import { Legend } from './Legend';
import { PlayerRow } from './PlayerRow';
import SteamApi from "../steam/SteamApi";
import { bind } from "../utilities/utilities";
import { ImportExport } from "./ImportExport";

import Storage, { IPlayers } from "../storage/Storage";

interface IVacList {
    players: IPlayers;
    showImportExport: boolean
}

/**
 * Driving smart component for the app.
 *
 * @class VacList
 * @extends {React.Component<any, IVacList>}
 */
class VacList extends React.Component<any, IVacList> {

    private storage: Storage;

    public constructor(props: any) {
        super(props);

        this.storage = new Storage();

        this.state = {
            players: this.storage.players,
            showImportExport: false
        }
    }

    public componentDidMount() {
        this.getBanStatus();
    }

    public render() {
        const players = Object.keys(this.state.players);
        const playerElements = players.map((id, index) => {
            const player = this.state.players[id];
            if (!player.status) {
                return (<tr />);
            }
            else {
                return (
                    <PlayerRow status={player.status} summary={player.summary} onDelete={this.handleDelete} key={index} />
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
                                <th>Steamid</th>
                                <th>Account Created</th>
                                <th>Bans</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {playerElements}
                        </tbody>
                    </table>
                </div>
                <Legend />
                <ImportExport display={this.state.showImportExport} data={JSON.stringify(this.state)} />
            </div>
        );
    }

    private getBanStatus() {
        // const state = JSON.parse(vaclist) as IVacList;
        console.log(Object.keys(this.state.players));
        SteamApi.getPlayerBans(Object.keys(this.state.players)).then(json => {
            const players = json.players;
            players.forEach((p: any) => {
                this.storage.updatePlayerStatus(p.SteamId, p);
            });
            this.setState({ players: this.storage.players });
        });
    }

    // Handlers

    @bind
    private handleImportExport() {
        this.setState(Object.assign(this.state, {
            showImportExport: !this.state.showImportExport
        }));
    }

    @bind
    private handleResolve() {
        const players = Object.keys(this.state.players);
        SteamApi.getPlayerSummaries(players).then(json => {
            console.log(json);
            json.response.players.forEach(player => {
                this.storage.updatePlayerSummary(player.steamid, player);
            });

            this.setState({ players: this.storage.players });
        });
    }

    @bind
    private handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const submittedId = (e.target as any).id.value;

        if (!submittedId) {
            return;
        }

        this.storage.addPlayer(submittedId);
        this.setState({ players: this.storage.players });
        this.getBanStatus();
    }

    @bind
    private handleDelete(id: string) {
        this.storage.removePlayer(id);
        this.setState({ players: this.storage.players });
    }
}

export default VacList;
