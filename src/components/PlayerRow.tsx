import * as React from 'react';

import { distanceInWords } from "date-fns"
import { IPlayerStatus, IPlayerSummary } from "../steam/SteamApi";

interface IPlayerRow {
    status: IPlayerStatus;
    summary?: IPlayerSummary;
    onDelete?: any;
}

enum EPersonaState {
    Offline = 0,
    Online = 1,
    Busy = 2,
    Away = 3,
    Snooze = 4,
    LookingToTrade = 5,
    LookingToPlay = 6
}

function getPersonaStateColor(personaState: EPersonaState) {
    switch (personaState) {
        case EPersonaState.Offline:
            return "#333";
            break;
        case EPersonaState.Online:
            return "green";
            break;
        case EPersonaState.Busy:
            return "red";
            break;
        case EPersonaState.Away:
            return "yellow";
            break;
        case EPersonaState.Snooze:
            return "white";
            break;
        case EPersonaState.LookingToTrade:
            return "green";
            break;
        case EPersonaState.LookingToPlay:
            return "green";
            break;
    }
}

export class PlayerRow extends React.Component<IPlayerRow, any> {

    public render() {
        if (this.props.summary) {
            return this.renderPlayerWithSummary();
        }
        else {
            return this.renderPlayerWithoutSummary();
        }
    }

    private renderPlayerWithSummary() {
        const status = this.props.status;
        const summary = this.props.summary;

        if (!status || !summary) {
            return (
                <tr />
            )
        }

        const avatarStyle: React.CSSProperties = {
            border: "3px #333 solid",
            borderColor: getPersonaStateColor(summary.personastate as EPersonaState)
        }

        return (
            <tr>
                <td style={{ overflowX: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", overflowX: "hidden" }}>
                        <img style={avatarStyle} src={summary.avatar} />
                        <a href={summary.profileurl}>
                            {summary.personaname}
                        </a>
                    </div>
                </td>
                <td>{status.SteamId}</td>
                <td>{this.renderDate(summary)}</td>
                <td>{this.renderBans(status)}</td>
                <td>{this.renderControls()}</td>
            </tr>
        );
    }

    private renderPlayerWithoutSummary() {
        const status = this.props.status;

        if (!status) {
            return <tr />
        }

        return (
            <tr>
                <td><a href={`https://steamcommunity.com/profiles/${status.SteamId}`}>{status.SteamId}</a></td>
                <td>{status.SteamId}</td>
                <td>Unknown</td>
                <td>{this.renderBans(status)}</td>
                <td>{this.renderControls()}</td>
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

    private renderBans(ban: IPlayerStatus) {

        if (!ban) {
            return (
                <div>nothing</div>
            )
        }

        return (
            <div>
                <i className="fas fa-gamepad" style={{ color: ban.NumberOfGameBans > 0 ? "white" : "#444" }} />
                <i className="fas fa-shield-alt" style={{ color: ban.VACBanned ? "white" : "#444" }} />
                <i className="far fa-handshake" style={{ color: ban.EconomyBan !== "none" ? "white" : "#444" }} />
            </div>
        );
    }

    private renderControls() {
        return (
            <div>
                <i className="fas fa-ellipsis-h" />
                <i className="fas fa-times" onClick={this.props.onDelete(this.props.status.SteamId)} />
            </div>
        );
    }
}