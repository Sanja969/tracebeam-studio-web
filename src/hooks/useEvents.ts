import { useEffect, useState } from "react";
import { captureError, measure, track } from "tracebeam";
import type { Event, EventQuery } from "../types/event";
import { buildEventsUrl, matchesQuery } from "../utils/utils";
import { API_URL } from "../constants/constants";

export const useEvents = (query: EventQuery = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let reconnectTimeout: number | undefined;
    let socket: WebSocket | null = null;
    let shouldReconnect = true;

    const limit = query.limit ?? 100;

    const loadEvents = async () => {
      try {
        await measure("studio.load-events", async () => {
          const response = await fetch(buildEventsUrl(query));
          const data: Event[] = await response.json();

          setEvents(data.slice(0, limit));
        });
      } catch (err) {
        await captureError(err as Error, {
          source: "tracebeam-studio-web",
          action: "load-events",
        });
      }
    };

    const connect = () => {
      socket = new WebSocket("ws://localhost:8080/ws");

      socket.onopen = () => {
        setConnected(true);
        void track("studio.websocket-connected");
      };

      socket.onclose = () => {
        setConnected(false);

        if (!shouldReconnect) {
          return;
        }

        void track("studio.websocket-disconnected");

        reconnectTimeout = window.setTimeout(() => {
          connect();
        }, 1500);
      };

      socket.onerror = () => {
        setConnected(false);
        socket?.close();
      };

      socket.onmessage = (message) => {
        const event: Event = JSON.parse(message.data);

        if (!matchesQuery(event, query)) {
          return;
        }

        setEvents((prev) => {
          if (prev.some((existingEvent) => existingEvent.id === event.id)) {
            return prev;
          }

          return [event, ...prev].slice(0, limit);
        });
      };
    };

    loadEvents();
    connect();

    return () => {
      shouldReconnect = false;

      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      socket?.close();
    };
  }, [query.limit, query.type, query.traceId, query.sessionId]);

  const clearEvents = async () => {
    await fetch(`${API_URL}/events`, {
      method: "DELETE",
    });

    setEvents([]);
  };

  return {
    events,
    connected,
    clearEvents,
  };
};