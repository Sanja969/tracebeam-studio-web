export type Event = {
  id: string;
  sessionId?: string;
  traceId: string;
  name: string;
  timestamp: number;
  receivedAt: number;
  type: string;
  duration?: number;
  metadata?: Record<string, unknown>;
};