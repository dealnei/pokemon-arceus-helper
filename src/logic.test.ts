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
