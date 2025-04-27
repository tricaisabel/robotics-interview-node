const SESSION_ID = "sessionId";

function parseISODate(isoDate) {
  if (!isoDate) {
    return "Not finished yet";
  }
  const date = new Date(isoDate);

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  return date.toLocaleString("en-US", options);
}

const getSessions = async () => {
  try {
    const res = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "query { sessions { id started ended detections resolved } }",
      }),
    });

    const json = await res.json();

    return json?.data?.sessions;
  } catch (err) {
    console.error("Error fetching sessions:", err);
    return null;
  }
};

const constructSessionCard = (session) => {
  const isOngoing = session.ended === null;
  const resolvedAll = session.resolved === session.detections;

  return `
    <div class="session-card">
      <div class="session-card-header">
        <h3>
          Session: <span class="session-id">${session.id}</span>
        </h3>
        <span class="detection-status ${resolvedAll ? "success" : "warning"}">
          <i class="bi ${
            resolvedAll
              ? "bi-check-circle-fill"
              : "bi-exclamation-triangle-fill"
          }"></i> ${
    isOngoing ? "Ongoing" : resolvedAll ? "All resolved" : "Incomplete"
  }
        </span>
      </div>

      <div class="session-date-flex-container">
        <div class="session-date-icon">
          <i class="bi bi-clock"></i>
          Time span
        </div>
        <div class="session-dates">
          <div class="session-start-date">${parseISODate(session.started)}</div>
          <div class="session-separator">-</div>
          <div class="session-end-date">${parseISODate(session.ended)}</div>
        </div>
      </div>

      <div class="session-detection-info">
        <strong>Resolved detections:</strong>
        <span class="detection-count">${session.resolved ?? "N/A"} / ${
    session.detections ?? "N/A"
  }</span>
      </div>

      ${
        isOngoing
          ? `
        <div class="session-inputs">
            <div class="inputs-container">

                <input type="number" id="resolved-input-${
                  session.id
                }" placeholder="Resolved" value="${session.resolved ?? ""}" />
                <input type="number" id="detections-input-${
                  session.id
                }" placeholder="Detections" value="${
              session.detections ?? ""
            }" />
            </div>
          
            <div>
                <button class="view-picture-link slim" onclick="saveStats('${
                  session.id
                }')">
            <i class="bi bi-save"></i> Save Stats
          </button>
            </div>

        </div>
        `
          : ""
      }

      <button class="accordion" onclick="renderLabels('${session.id}')">
        View labels
      </button>
    </div>
  `;
};

const renderSessions = async () => {
  const sessions = await getSessions();
  const container = document.querySelector("#sessions-container");

  sessions.forEach((session) => {
    const sessionDiv = document.createElement("div");
    sessionDiv.classList.add("session");

    sessionDiv.innerHTML = constructSessionCard(session);

    container.appendChild(sessionDiv);
  });
};

const getLabelsBySessionId = async (id) => {
  try {
    const res = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "query Labels($sessionId: ID!) { labels(sessionId: $sessionId) { id image timestamp data { width height x y w h cameraIndex cameraType } } }",
        variables: {
          sessionId: id,
        },
      }),
    });

    const json = await res.json();

    return json?.data?.labels;
  } catch (err) {
    console.error("Error fetching labels:", err);
    return null;
  }
};

const constructLabelCard = (label) => {
  const imgSrc = `data:image/jpeg;base64,${label.image}`;
  return `
    <div class="label-card">
            <div class="label-info">
              <div class="label-card-header">
                <h2>
                  Label: <span class="label-id">${label.id}</span>
                </h2>
              </div>
              <div class="label-card-details">
                <p><i class="bi bi-clock"></i> ${label.timestamp}</p>
                <p>
                  <i class="bi bi-arrows-fullscreen"></i>
                  <strong>Image:</strong> ${label.data?.width} × ${label.data?.height} px
                </p>
                <p>
                  <i class="bi bi-arrows-move"></i>
                  <strong>Position:</strong> X: ${label.data?.x}, Y: ${label.data?.y}
                </p>
                <p>
                  <i class="bi bi-aspect-ratio-fill"></i>
                  <strong>Box Size:</strong> W: ${label.data?.w}px × H: ${label.data?.h}px
                </p>
                <p>
                  <i class="bi bi-camera-video"></i>
                  <strong>Camera index:</strong> ${label.data?.cameraIndex}
                </p>
                <p>
                  <i class="bi bi-palette"></i>
                  <strong>Camera type:</strong> ${label.data?.cameraType}
                </p>
              </div>
              <div class="label-card-footer">
                <a href="/image/${label.id}" target="_blank">
                  <button class="view-picture-link">View picture</button>
                </a>
              </div>
            </div>
            <div class="label-picture">
              <img src="${imgSrc}" alt="Label Image"/>
            </div>
          </div>
    
    `;
};

const renderLabels = async (id) => {
  const panel = document.querySelector("#labels-explorer");
  const infoPanel = document.querySelector("#select-session-info");
  const infoPanelNoSessionSelectedP = document.querySelector(
    "#select-session-info-no-session-selected"
  );
  const infoPanelNoLabelsP = document.querySelector(
    "#select-session-info-no-labels"
  );

  if (event.target.classList.contains("active")) {
    event.target.classList.remove("active");
    panel.innerHTML = "";
    infoPanelNoSessionSelectedP.style.display = "inline";
    infoPanelNoLabelsP.style.display = "none";
    infoPanel.style.display = "flex";
    return;
  }

  const buttons = document.querySelectorAll(".active");
  buttons.forEach((button) => button.classList.remove("active"));

  event.target.classList.add("active");

  const labels = await getLabelsBySessionId(id);

  panel.innerHTML = "";

  if (labels && labels.length > 0) {
    labels.forEach((label) => {
      const labelDiv = document.createElement("div");
      labelDiv.classList.add("label");

      labelDiv.innerHTML = constructLabelCard(label);

      panel.appendChild(labelDiv);
    });
    infoPanel.style.display = "none";
  } else {
    infoPanelNoSessionSelectedP.style.display = "none";
    infoPanelNoLabelsP.style.display = "inline";
    infoPanel.style.display = "flex";
  }
};

const insertSession = (session) => {
  const container = document.querySelector("#sessions-container");

  const sessionDiv = document.createElement("div");
  sessionDiv.classList.add("session");
  sessionDiv.innerHTML = constructSessionCard(session);

  container.prepend(sessionDiv);
  localStorage.setItem(SESSION_ID, session.id);
};

const startSession = async () => {
  try {
    const res = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "mutation { start_session { id started ended detections resolved } }",
      }),
    });

    const json = await res.json();
    await insertSession(json?.data?.start_session);
  } catch (err) {
    alert(err);
    console.error("Error starting session:", err);
  }
};

const saveStats = async (sessionId) => {
  const det = document.querySelector(`#detections-input-${sessionId}`).value;
  const res = document.querySelector(`#resolved-input-${sessionId}`).value;
  try {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Session-ID": sessionId },
      body: JSON.stringify({
        query: `
          mutation ($detections: Int!, $resolved: Int!) {
            set_session_stats(detections: $detections, resolved: $resolved) {
              id
              detections
              resolved
            }
          }
        `,
        variables: {
          detections: parseInt(det.trim()),
          resolved: parseInt(res.trim()),
        },
      }),
    });

    const result = await response.json();
    if (result.data?.set_session_stats) {
      window.location.reload();
    }
  } catch (err) {
    console.error("Failed to save stats:", err);
  }
};

const endSession = async () => {
  try {
    const sessionId = localStorage.getItem(SESSION_ID);
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Session-ID": sessionId },
      body: JSON.stringify({
        query: `mutation { end_session { id ended } }`,
      }),
    });

    const result = await response.json();
    if (result.data?.end_session) {
      localStorage.removeItem(SESSION_ID);
      window.location.reload();
    }
  } catch (err) {
    console.error("Failed to end session:", err);
  }
};

const handleSession = async () => {
  const sessionId = localStorage.getItem(SESSION_ID);
  if (sessionId) {
    await endSession();
  } else {
    await startSession();
  }
  renderHandleSessionButton();
};

const renderHandleSessionButton = async () => {
  const sessionId = localStorage.getItem(SESSION_ID);
  const button = document.querySelector("#start-stop-session");
  if (sessionId) {
    button.innerHTML = "Stop session";
  } else {
    button.innerHTML = "Start session";
  }
};

renderSessions();
renderHandleSessionButton();
