import * as React from "react";
import { bind } from "../utilities/utilities";

interface IImportExport {
    display: boolean;
    data: string;
    onImport?: () => void;
}

export class ImportExport extends React.Component<any, IImportExport> {
    public render() {
        const modalStyle: React.CSSProperties = {
            width: "500px",
            height: "400px",
            maxHeight: "calc(100% - 100px)",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: this.props.display ? "block" : "none",
            color: "#eee",
            backgroundColor: "#273245",
            padding: "10px"
        }

        const innerStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: "column",
            height: "100%"
        }

        return (
            <div style={modalStyle}>
                <div style={innerStyle}>
                    <div style={{ flexGrow: 1 }}>
                        <textarea onChange={this.onChangeHandler} style={{ width: "100%", height: "100%", border: 0 }} value={this.props.data} />
                    </div>
                    <div style={{ paddingTop: "10px", display: "flex" }}>
                        <button>Copy to clipboard</button>
                        <button>Import</button>
                    </div>
                </div>
            </div>
        );
    }

    @bind
    private onChangeHandler(e: React.ChangeEvent) {
        console.log(e);
    }

}