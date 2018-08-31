import * as React from 'react';

import { distanceInWords } from "date-fns"
import { IPlayerBan, IPlayerSummary } from "./steam/SteamApi";

interface IPlayerRow {
    ban: IPlayerBan;
    summary: IPlayerSummary;
}

export class PlayerRow extends React.Component<IPlayerRow, any> {

    public render() {
        const ban = this.props.ban;
        const summary = this.props.summary;

        return (
            <tr>
                <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img src={summary.avatar} />
                        <a href={summary.profileurl}>
                            {summary.personaname}
                        </a>
                    </div>
                </td>
                <td>{this.renderDate(summary)}</td>
                <td>{this.renderBans(ban)}</td>
            </tr>
        );
    }

    private renderDate(summary: IPlayerSummary) {
        const date = new Date(0);
        date.setUTCSeconds(summary.timecreated)
        if (!isNaN(date.getTime())) {
            return (
                <div>
                    <time>{date.toDateString()}</time>
                    <span> ({distanceInWords(date, new Date())})</span>
                </div>
            );
        }
        else {
            return (
                <div>Unknown</div>
            );
        }

    }

    private renderBans(ban: IPlayerBan) {
        return (
            <div>
                <i className="fas fa-gamepad" style={{ color: ban.CommunityBanned ? "white" : "#444" }} />
                <i className="fas fa-shield-alt" style={{ color: ban.VACBanned ? "white" : "#444" }} />
                <i className="far fa-handshake" style={{ color: ban.EconomyBan !== "none" ? "white" : "#444" }} />
            </div>
        );

    }
}