// open-next.config.ts — Cloudflare Workers deployment configuration
// This file is used by @opennextjs/cloudflare, not by Next.js itself.
// See: https://opennext.js.org/cloudflare

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const config: any = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
      // Uncomment when using D1:
      // tagCache: 'cloudflare-d1',
      // incrementalCache: 'cloudflare-kv-fetch',
      incrementalCache: 'dummy',
      tagCache: 'dummy',
      queue: 'dummy',
    },
  },
  middleware: {
    external: true,
    override: {
      wrapper: 'cloudflare-edge',
      converter: 'edge',
      proxyExternalRequest: 'fetch',
    },
  },
};

export default config;
