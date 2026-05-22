import { useEffect, useState } from "react";
import { captureError, measure, track } from "tracebeam";
import type { Event } from "../types/event";
import { API_URL, WS_URL } from "../constants/constants";

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let reconnectTimeout: number | undefined;
    let socket: WebSocket | null = null;

    const loadEvents = async () => {
      try {
        await measure(
          "studio.load-events",
          async () => {
            const response = await fetch(`${API_URL}/events`);
            const data: Event[] = await response.json();

            setEvents([...data]);
          },
          {
            source: "tracebeam-studio-web",
          },
        );
      } catch (err) {
        await captureError(err as Error, {
          source: "tracebeam-studio-web",
          action: "load-events",
        });

        console.log("Failed to load existing events", err);
      }
    };

    const connect = () => {
      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        setConnected(true);

        void track("studio.websocket-connected", {
          source: "tracebeam-studio-web",
        });
      };

      socket.onclose = () => {
        setConnected(false);

        void track("studio.websocket-disconnected", {
          source: "tracebeam-studio-web",
        });

        reconnectTimeout = window.setTimeout(() => {
          connect();
        }, 1500);
      };

      socket.onerror = () => {
        setConnected(false);
        socket?.close();

        void captureError(new Error("WebSocket connection error"), {
          source: "tracebeam-studio-web",
          action: "websocket-error",
        });
      };

      socket.onmessage = (message) => {
        const event: Event = JSON.parse(message.data);

        setEvents((prev) => {
          if (prev.some((existingEvent) => existingEvent.id === event.id)) {
            return prev;
          }

          return [event, ...prev];
        });
      };
    };

    loadEvents();
    connect();

    return () => {
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      socket?.close();
    };
  }, []);

  const clearEvents = async () => {
    try {
      await measure(
        "studio.clear-events",
        async () => {
          await fetch(`${API_URL}/events`, {
            method: "DELETE",
          });

          setEvents([]);
        },
        {
          source: "tracebeam-studio-web",
        },
      );
    } catch (err) {
      await captureError(err as Error, {
        source: "tracebeam-studio-web",
        action: "clear-events",
      });
    }
  };

  return {
    events,
    connected,
    clearEvents,
  };
};