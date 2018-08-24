import * as React from 'react';
import './App.css';

import VacList from "./VacList";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <VacList />
      </div>
    );
  }
}

export default App;
