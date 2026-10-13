import {describe,it,expect} from 'vitest';
import {DEX_NAMES,investGrade,INVEST_LINES,setInvestCatalog} from './data/legacy';
import {recommend,replacementIdeas,teamSnapshot} from './teamEngine';
import type {Pokemon} from './types';
const sample=(name:string,dex:number,type:string,stats:number[]):Pokemon=>({name,dex,type,stats,locations:'Obsidian Fieldlands',evolution:'-',id:dex});
describe('Hisui Pokédex data',()=>{
 it('includes exactly 242 regional entries and evolution stages',()=>{
  expect(DEX_NAMES).toHaveLength(242);
  expect(new Set(DEX_NAMES).size).toBe(242);
  expect(INVEST_LINES.flat()).toEqual(expect.arrayContaining(['Magikarp','Gyarados','Scyther','Kleavor','Scizor']));
 });
 it('grades early-stage species by their investable evolution',()=>{
  const catalog=DEX_NAMES.map((name:string,i:number)=>sample(name,i+1,'Normal',[50,50,50,50,50,50]));
  setInvestCatalog(catalog);
  expect(investGrade(catalog.find((p:Pokemon)=>p.name==='Magikarp')).grade).toBe('S');
  expect(investGrade(catalog.find((p:Pokemon)=>p.name==='Magikarp')).target).toBe('Gyarados');
  expect(investGrade(catalog.find((p:Pokemon)=>p.name==='Unown')).grade).toBe('F');
 });
});
describe('Team engine',()=>{
 const mons=[
  sample('Garchomp',189,'Dragon / Ground',[108,130,95,80,85,102]),
  sample('Gyarados',81,'Water / Flying',[95,125,79,60,100,81]),
  sample('Togekiss',129,'Fairy / Flying',[85,50,95,120,115,80]),
  sample('Lucario',224,'Fighting / Steel',[70,110,70,115,70,90]),
  sample('Pachirisu',109,'Electric',[60,45,70,45,90,95]),
  sample('Rapidash',24,'Fire',[65,100,70,80,80,105]),
  sample('Unown',142,'Psychic',[48,72,48,72,48,48])
 ];
 const opts={caughtOnly:false,allowLegendaries:true,caught:new Set<number>()};
 it('scores teams without a DOM or backend',()=>{
  const report=teamSnapshot(mons.slice(0,3));
  expect(report.ts).toHaveLength(3);
  expect(report.coverage.size).toBeGreaterThan(0);
 });
 it('does not suggest existing teammates as additions',()=>{
  const ideas=recommend(mons.slice(0,2),mons,opts,'balanced',0);
  expect(ideas.every((idea:{p:Pokemon})=>!['Garchomp','Gyarados'].includes(idea.p.name))).toBe(true);
 });
 it('returns an array of optional replacements',()=>{
  expect(Array.isArray(replacementIdeas(mons.slice(0,4),mons,opts,'balanced'))).toBe(true);
 });
});

describe('Hisui regional-map location list',()=>{
 const fixture=(locations:string):import('./types').Pokemon=>({dex:10,id:399,name:'Bidoof',type:'Normal',evolution:'-',locations,stats:[]});
 it('links known subareas to their correct regional maps',async()=>{
  const {getEncounterPlaces,REGION_MAPS}=await import('./data/hisuiMaps');
  const list=getEncounterPlaces(fixture('Horseshoe Plains, Bolderoll Slope, Crossing Slope, Lake Acuity'));
  expect(list.map(x=>x.region)).toEqual(['Obsidian Fieldlands','Crimson Mirelands','Cobalt Coastlands','Alabaster Icelands']);
  expect(list.map(x=>x.mapUrl)).toEqual([REGION_MAPS['Obsidian Fieldlands'],REGION_MAPS['Crimson Mirelands'],REGION_MAPS['Cobalt Coastlands'],REGION_MAPS['Alabaster Icelands']]);
 });
 it('does not claim an evolution method has a physical map marker',async()=>{
  const {getEncounterPlaces}=await import('./data/hisuiMaps');
  expect(getEncounterPlaces(fixture('Evolve Scyther'))).toEqual([{label:'Evolve Scyther',region:null,mapUrl:null,kind:'method'}]);
 });
 it('uses a known note region when distortion placement is generic',async()=>{
  const {getEncounterPlaces,REGION_MAPS}=await import('./data/hisuiMaps');
  const [entry]=getEncounterPlaces(fixture('Space-Time Distortion'),'Encounter in Coronet Highlands space-time distortions');
  expect(entry.mapUrl).toBe(REGION_MAPS['Coronet Highlands']);
  expect(entry.label).toMatch(/Coronet Highlands/i);
 });
 it('uses the safe map index for unknown source locations',async()=>{
  const {getEncounterPlaces,MAP_DIRECTORY}=await import('./data/hisuiMaps');
  expect(getEncounterPlaces(fixture('Unmapped Fictional Canyon'))[0].mapUrl).toBe(MAP_DIRECTORY);
 });
});

describe('structured PLA evolution methods',()=>{
 const p=(dex:number,evolution:string)=>({dex,evolution});
 it('lists each level-up stage separately',async()=>{
  const {getEvolutionSteps}=await import('./data/evolutionSteps');
  expect(getEvolutionSteps(p(1,'Rowlet – Lvl 17 → Dartrix – Lvl 36 → Decidueye')).map(s=>[s.from,s.to,s.requirement])).toEqual([
   ['Rowlet','Dartrix','Level 17'],['Dartrix','Decidueye','Level 36']
  ]);
 });
 it('preserves all eight Eevee branches and the corresponding conditions',async()=>{
  const {getEvolutionSteps}=await import('./data/evolutionSteps');
  const steps=getEvolutionSteps(p(25,'Eevee → Vaporeon | Jolteon'));
  expect(steps).toHaveLength(8);
  expect(steps.find(s=>s.to==='Umbreon')?.requirement).toMatch(/night/);
  expect(steps.find(s=>s.to==='Sylveon')?.requirement).toMatch(/Fairy-type/);
 });
 it('handles branching Wurmple and male Kirlia evolution properly',async()=>{
  const {getEvolutionSteps}=await import('./data/evolutionSteps');
  const wurmple=getEvolutionSteps(p(18,'Wurmple – Lvl 7 → Silcoon – Lvl 10 → Beautifly | – Lvl 7 → Cascoon – Lvl 10 → Dustox'));
  expect(wurmple.find(s=>s.to==='Cascoon')).toMatchObject({from:'Wurmple',requirement:'Level 7'});
  const ralts=getEvolutionSteps(p(102,'Ralts – Lvl 20 → Kirlia – Lvl 30 → Gardevoir | – Dawn Stone, Male → Gallade'));
  expect(ralts.find(s=>s.to==='Gallade')).toMatchObject({from:'Kirlia',requirement:'Dawn Stone, Male'});
 });
 it('handles trade items in Legends and no-evolution species',async()=>{
  const {getEvolutionSteps}=await import('./data/evolutionSteps');
  const scyther=getEvolutionSteps(p(72,'Scyther – Trade holding Metal Coat → Scizor | – Black Augurite → Kleavor'));
  expect(scyther.find(s=>s.to==='Scizor')?.requirement).toBe('Use Metal Coat');
  expect(scyther.find(s=>s.to==='Kleavor')).toMatchObject({from:'Scyther',requirement:'Black Augurite'});
  expect(getEvolutionSteps(p(238,'-'))).toEqual([]);
 });
});
