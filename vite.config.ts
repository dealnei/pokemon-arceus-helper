import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
 plugins:[react()],
 // Relative paths let GitHub Pages serve compiled assets from /pokemon-arceus-helper/.
 base:'./',
 build:{outDir:'dist',emptyOutDir:true}
});
