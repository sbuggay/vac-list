import * as React from 'react';

class Input extends React.Component {

    public handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        let ids = localStorage.getItem("vaclist");
        if (!ids) {
            ids = JSON.stringify([]);
        }
        const parsedIds = JSON.parse(ids);
        const submittedId = (e.target as any).id.value;
        
        if (!submittedId) {
            return false;
        }

        parsedIds.push(submittedId);
        localStorage.setItem("vaclist", JSON.stringify(parsedIds));

        return false;
    }

    public render() {
        return (
            <div className="Input">
                <form onSubmit={this.handleSubmit}>
                    <input placeholder="steamid v3" name="id" />
                    <button>Submit</button>
                </form>
            </div>
        );
    }
}

export default Input;
