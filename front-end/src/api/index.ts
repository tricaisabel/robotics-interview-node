import config from "../config";

export const getSessions = async () => {
  try {
    const res = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "query { sessions { id started ended detections resolved } }",
      }),
    });

    const json = await res.json();
    return json?.data?.sessions || [];
  } catch (err) {
    console.error("Error fetching sessions:", err);
    throw err;
  }
};

export const getCurrentSession = async () => {
  try {
    const res = await fetch(config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "query { current_session { id started ended detections resolved } }",
      }),
    });

    const json = await res.json();
    return json?.data?.current_session;
  } catch (err) {
    console.error("Error fetching sessions:", err);
    throw err;
  }
};

export const startSession = async () => {
  try {
    const res = await fetch(config.apiUrl, {
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
    return json?.data?.start_session;
  } catch (err) {
    console.error("Error starting session:", err);
    return null;
  }
};

export const endSession = async (sessionId: string) => {
  try {
    const res = await fetch(config.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Session-ID": sessionId },
      body: JSON.stringify({
        query: `mutation { end_session { id ended } }`,
      }),
    });

    const json = await res.json();
    return json?.data?.end_session;
  } catch (err) {
    console.error("Failed to end session:", err);
  }
};

export const saveStats = async ({
  sessionId,
  detections,
  resolved,
}: {
  sessionId: string;
  detections: number;
  resolved: number;
}) => {
  try {
    const response = await fetch(config.apiUrl, {
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
        variables: { detections, resolved },
      }),
    });

    const result = await response.json();
    return result.data?.set_session_stats;
  } catch (err) {
    console.error("Failed to save stats:", err);
  }
};

export const getLabelsBySessionId = async (sessionId: string) => {
  try {
    const res = await fetch(config.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
            query Labels($sessionId: ID!) { 
              labels(sessionId: $sessionId) { 
                id 
                image 
                timestamp 
                data { 
                  width height x y w h cameraIndex cameraType 
                } 
              } 
            }`,
        variables: { sessionId },
      }),
    });

    const json = await res.json();
    return json?.data?.labels || [];
  } catch (err) {
    console.error("Error fetching labels:", err);
    throw err;
  }
};
