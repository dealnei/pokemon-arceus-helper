import type {Pokemon} from '../types';
import {EXTRA_METHODS} from './legacy';

export type EvolutionStep={from:string;to:string;requirement:string;guideUrl:string};
const BASE='https://www.serebii.net/pokedex-swsh/';
const GENERAL_GUIDE='https://www.serebii.net/legendsarceus/evolution.shtml';
const MISSING=/^(?:-|none|no evolution)$/i;

export function pokemonEvolutionGuide(name:string):string{
 // Serebii's Generation VIII Pokédex includes a Legends: Arceus tab.
 // For unfamiliar spelling, fall back to its verified general evolution guide.
 if(!/^[A-Za-z0-9 .'-]+$/.test(name))return GENERAL_GUIDE;
 const slug=name.toLowerCase().replace(/\s+/g,'').replace(/'/g,'');
 return BASE+encodeURIComponent(slug)+'/';
}

const tidy=(text:string)=>text
 .replace(/\bLvl\.?\s*(\d+)/gi,'Level $1')
 .replace(/Trade holding\s*/gi,'Use ')
 .replace(/Trade with\s*/gi,'Use ')
 .replace(/\bTrade\b/gi,'Use a Linking Cord or trade')
 .replace(/\bUpgrade\)/gi,'Upgrade')
 .replace(/\s+/g,' ').trim()
 .replace(/^use\s+(?=a?\s*(?:black augurite|metal coat|razor claw|razor fang|dawn stone|sun stone|water stone|fire stone|thunder stone|leaf stone|ice stone|linking cord))/i,'Use ');

function parsePart(text:string):{name:string;requirement:string}{
 const match=/^(.*?)\s+[–—-]\s+(.+)$/.exec(text.trim());
 return match?{name:match[1].trim(),requirement:tidy(match[2])}:{name:text.trim(),requirement:''};
}
function make(from:string,to:string,method:string):EvolutionStep{
 return {from,to,requirement:method||'See the detailed evolution requirements',guideUrl:pokemonEvolutionGuide(to)};
}
export function getEvolutionSteps(pokemon:Pick<Pokemon,'dex'|'evolution'>):EvolutionStep[]{
 const raw=(pokemon.evolution||'').trim();
 if(!raw||MISSING.test(raw))return [];
 // Eevee lists every branch but stores requirements separately in curated PLA rules.
 if(pokemon.dex===25){
  const description=String(EXTRA_METHODS[25]||'');
  return description.split(/\s*·\s*/).map(part=>{
   const pos=part.indexOf(':');
   return pos<0?null:make('Eevee',part.slice(0,pos).trim(),tidy(part.slice(pos+1).replace(/\.$/,'')));
  }).filter((step):step is EvolutionStep=>step!==null);
 }
 const variants=raw.split(/\s*\|\s*/).filter(Boolean);
 const results:EvolutionStep[]=[];
 let originalSteps:EvolutionStep[]=[];
 for(let i=0;i<variants.length;i++){
  let v=variants[i].trim();
  if(i>0){
   const shorthand=/^[–—-]\s*(.+)$/.exec(v);
   if(shorthand){
    const method=tidy(shorthand[1].split(/\s*→/)[0]);
    // An alternative can branch from either the first or penultimate form.
    const same=originalSteps.find(step=>step.requirement.toLowerCase()===method.toLowerCase());
    const from=same?.from||originalSteps.at(-1)?.from||parsePart(variants[0].split('→')[0]).name;
    v=from+' – '+shorthand[1];
   }else if(!v.includes('→')){
    // A destination-only alternative, e.g. Eevee's list, inherits the origin.
    v=parsePart(variants[0].split('→')[0]).name+' → '+v;
   }
  }
  const nodes=v.split(/\s*→\s*/).map(x=>x.trim());
  const group:EvolutionStep[]=[];
  for(let j=0;j<nodes.length-1;j++){
   const source=parsePart(nodes[j]);
   const target=parsePart(nodes[j+1]);
   if(source.name&&target.name)group.push(make(source.name,target.name,source.requirement));
  }
  if(i===0)originalSteps=group;
  results.push(...group);
 }
 return results.filter((step,i)=>results.findIndex(other=>other.from===step.from&&other.to===step.to)===i);
}
