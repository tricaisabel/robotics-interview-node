import ReactDOM from "react-dom/client";
import "./spectaql.min.css";
import App from "./App";
import { CurrentSessionProvider } from "./contexts/currentSessionContext";
import { LabelsProvider } from "./contexts/labelsContext";
import { SessionsProvider } from "./contexts/sessionsContext";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  // <React.StrictMode>
  <CurrentSessionProvider>
    <SessionsProvider>
      <LabelsProvider>
        <Toaster />
        <App />
      </LabelsProvider>
    </SessionsProvider>
  </CurrentSessionProvider>
  // </React.StrictMode>
);
