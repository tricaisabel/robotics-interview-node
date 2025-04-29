import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import StartStopSessionButton from "./components/StartStopSessionButton";
import SessionList from "./components/SessionsList";
import LabelList from "./components/LabelList";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="main-container">
      <div className="column left-drawer">
        <div className="session-card-header">
          <h1>Detection Sessions</h1>
          <StartStopSessionButton />
        </div>
        <SessionList />
      </div>
      <div className="column labels-explorer">
          <LabelList />
      </div>
    </div>
  );
};

export default App;
