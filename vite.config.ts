import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
 plugins:[react()],
 // Relative assets work on GitHub Pages subpaths and standalone preview domains.
 base:'./',
 build:{outDir:'dist',emptyOutDir:true}
});
