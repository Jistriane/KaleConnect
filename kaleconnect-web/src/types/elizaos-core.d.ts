declare module '@elizaos/core' {
  export class AgentRuntime {
    constructor(opts: Record<string, unknown>);
    initialize?: () => Promise<void>;
  }
  export function createLogger(name: string): {
    info?: (...args: unknown[]) => void;
    error?: (...args: unknown[]) => void;
  };
}
