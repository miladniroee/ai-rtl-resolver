/** Minimal Chrome extension APIs used by this project. */
declare namespace chrome {
  namespace runtime {
    function getURL(path: string): string;
    function sendMessage(message: unknown): Promise<unknown>;
    namespace onMessage {
      function addListener(
        callback: (message: { type: string; enabled?: boolean }) => void,
      ): void;
    }
  }
  namespace storage {
    namespace local {
      function get(keys: string): Promise<Record<string, unknown>>;
      function set(items: Record<string, unknown>): Promise<void>;
    }
  }
}
