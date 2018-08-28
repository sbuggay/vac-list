import * as React from 'react';

interface IInput {
    handleSubmit: any;
}

class Input extends React.Component<IInput, any> {

    public render() {
        return (
            <div className="Input">
                <form onSubmit={this.props.handleSubmit}>
                    <input placeholder="steamid v3" name="id" />
                    <button>Submit</button>
                </form>
            </div>
        );
    }
}

export default Input;
