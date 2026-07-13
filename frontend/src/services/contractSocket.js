import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export function connectContractSocket({ onMessage }) {
  if (client && client.active) {
    return client;
  }

  const wsUrl = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8082") + "/ws"; // backend websocket (theo yêu cầu của bạn)
  const sock = () => new SockJS(wsUrl);

  client = new Client({
    webSocketFactory: sock,
    reconnectDelay: 3000,
    debug: () => {},
    onConnect: () => {
      client.subscribe("/topic/contracts/changed", (frame) => {
        try {
          const body = frame.body ? JSON.parse(frame.body) : {};
          onMessage?.(body);
        } catch (e) {
          // ignore parse error
        }
      });
    },
  });

  client.activate();
  return client;
}

export function disconnectContractSocket() {
  if (client) {
    try {
      client.deactivate();
    } catch (e) {
      // ignore
    }
    client = null;
  }
}

