/** Minimal Chrome extension APIs used by this project. */
declare namespace chrome {
  namespace runtime {
    function getURL(path: string): string;
    function sendMessage(message: unknown): Promise<unknown>;
  }
}
