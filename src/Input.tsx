import * as React from 'react';

interface IInput {
    handleSubmit: any;
}

class Input extends React.Component<IInput, any> {

    public render() {
        return (
            <form className="Input" onSubmit={this.props.handleSubmit}>
                <input placeholder="steamid v3" name="id" />
                <button>Submit</button>
            </form>
        );
    }
}

export default Input;
