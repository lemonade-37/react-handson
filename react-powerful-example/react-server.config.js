export default {
  server: {
    port: 3000,
  },
  experimental: {
    searchParams: true,
  },
  vite: {
    define: {
      'process.env': '{}',
      'global': 'globalThis',
      'module': 'undefined',
      '__dirname': 'undefined',
      '__filename': 'undefined',
    },
  },
};