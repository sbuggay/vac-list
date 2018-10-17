import * as React from 'react';

// import { Button } from "evergreen-ui"

interface IInput {
    handleSubmit: any;
}

class Input extends React.Component<IInput, any> {

    public render() {
        return (
            <form className="Input" onSubmit={this.submit}>
                <input placeholder="SteamID or Vanity URL" name="id" />
                <button style={{ color: "white", backgroundImage: "linear-gradient(rgb(121, 153, 5) 5%, rgb(83, 105, 4) 95%)" }}>Submit</button>
            </form>
        );
    }

    private submit() {
        this.props.handleSubmit();
    }
}

export default Input;
