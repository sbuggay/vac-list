import * as React from "react";
import * as ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import VacList from "./components/VacList";

ReactDOM.render(
  <VacList />,
  document.getElementById("root") as HTMLElement
);
registerServiceWorker();
