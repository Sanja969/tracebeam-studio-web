import { configure, enableOverlay } from "tracebeam";

configure({
  bufferEvents: true,
  transport: async (event) => {
    await fetch("http://localhost:8080/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    });
  },
});

enableOverlay();