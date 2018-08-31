import * as React from 'react';

export class Legend extends React.Component {
    
    public render() {
        return (
            <div className="Legend" style={this.getStyle()}>
                <div><i className="fas fa-gamepad" />Community Banned</div>
                <div><i className="fas fa-shield-alt" />VAC Banned</div>
                <div><i className="far fa-handshake" />Economy Banned</div>
            </div>
        );
    }

    private getStyle(): React.CSSProperties {
        return {
            display: "flex",
            paddingTop: "20px"
        }
    }
}