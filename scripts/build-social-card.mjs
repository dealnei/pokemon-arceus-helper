import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {Resvg} from '@resvg/resvg-js';
const input=fileURLToPath(new URL('../assets/social-card.svg',import.meta.url));
const output=fileURLToPath(new URL('../public/social-card.png',import.meta.url));
const rendered=new Resvg(readFileSync(input),{fitTo:{mode:'width',value:1200}}).render();
writeFileSync(output,rendered.asPng());
console.log('Generated public/social-card.png (1200 × 630)');
