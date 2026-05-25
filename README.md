# Tracebeam Studio Web

Realtime local dashboard for Tracebeam events.

## What it does

- Displays realtime events from Tracebeam Studio Server
- Shows sessions, traces, errors, fetch requests and performance charts
- Connects to `ws://localhost:8080/ws`

---

## Run locally

```bash
npm install
npm run dev
```

Dashboard runs on:

http://localhost:5173

---

## Connect an app

Install SDK:

```bash
npm install tracebeam
```
```ts
import {
  configure,
  enableFetchInstrumentation,
  enableGlobalErrorCapture,
} from "tracebeam";

configure({
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

enableFetchInstrumentation();
enableGlobalErrorCapture();
```

## Current status

Tracebeam Studio Web is actively being developed and expanded with additional observability tooling features.

## License

MIT