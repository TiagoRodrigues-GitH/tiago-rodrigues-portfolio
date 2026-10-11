/// <reference lib="webworker" />
/**
 * Runs the routing algorithms off the main thread, so a long search (Bellman-Ford or an ant colony on Sao Paulo)
 * never freezes the page or the map. The worker loads the street graph itself (same URL as the page: the browser
 * serves it from its cache) and answers with the route and its trace, moved without copying.
 */

import { handleRoutingRequest } from './routing-protocol';

addEventListener('message', ({ data }: MessageEvent) => {
  void handleRoutingRequest(data, (reply, transfer) => postMessage(reply, transfer));
});
