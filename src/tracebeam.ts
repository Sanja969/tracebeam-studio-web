import { enableOverlay } from "tracebeam";

if (import.meta.env.DEV) {
  enableOverlay();
}
