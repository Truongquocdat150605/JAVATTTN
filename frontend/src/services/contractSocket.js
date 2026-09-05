import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WS_URL } from "../config";

let client = null;

export function connectContractSocket({ onMessage }) {
  if (client && client.active) {
    return client;
  }

  const wsUrl = WS_URL;
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

