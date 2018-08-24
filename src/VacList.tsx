import * as React from 'react';

import Input from "./Input";
import SteamApi from "./steam/SteamApi";

interface IPlayer {
    CommunityBanned: boolean;
    DaysSinceLastBan: number;
    EconomyBan: string;
    NumberOfGameBans: number;
    NumberOfVACBans: number;
    SteamId: string;
    VACBanned: boolean;
    dateAdded: number;
}

interface ISummary {
    personaname: string;
    profileurl: string;
    avatar: string;
}

interface IVacList {
    players: IPlayer[];
    summaries: { [key: string]: ISummary }
}

class VacList extends React.Component<any, IVacList> {

    private steamApi: SteamApi;

    public constructor(props: any) {
        super(props);

        this.steamApi = new SteamApi();

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
        });
    }

    public render() {
        const players = this.state.players;

        const playerElements = players.map((player, index) => {
            return (
                <tr key={index}>
                    <td><a href={`https://steamcommunity.com/profiles/${player.SteamId}`}>{player.SteamId}</a></td>
                    <td>{player.CommunityBanned ? "true" : "false"}</td>
                    <td>{player.VACBanned ? "true" : "false"}</td>
                    <td>{player.EconomyBan}</td>
                </tr>
            );
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
                    <Input />
                    <div>
                        <button>Import</button>
                        <button>Export</button>
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
}

export default VacList;
