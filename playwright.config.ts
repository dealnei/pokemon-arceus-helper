import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',
 timeout:30000,
 use:{baseURL:'http://127.0.0.1:4173',trace:'retain-on-failure'},
 webServer:{
  // Serve the exact Vite production output that GitHub Pages will publish.
  command:'python3 -m http.server 4173 --bind 127.0.0.1 --directory dist',
  url:'http://127.0.0.1:4173/',
  reuseExistingServer:!process.env.CI,
  timeout:60000
 },
 projects:[{name:'chromium',use:{browserName:'chromium'}}]
});
