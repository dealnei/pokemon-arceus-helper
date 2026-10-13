import {useCallback,useEffect,useMemo,useState} from 'react';
import {Alert,Button} from '@mantine/core';
import type {Pokemon} from './types';
import {DEX_NAMES,DATA_SOURCES,fetchText,parseCSV,getStats,setInvestCatalog,investGrade,natures,NATURES,rarity,evolution,obtain} from './data/legacy';
import PokemonTable from './components/PokemonTable';
import PokemonDetails from './components/PokemonDetails';
import TeamLab from './components/TeamLab';
function initialSet(key:string){
 try{return new Set<number>((JSON.parse(localStorage.getItem('hisui-v3-'+key)||'[]') as number[]).filter(x=>Number.isInteger(x)))}catch{return new Set<number>()}
}
function useStoredSet(key:string){
 const [items,setItems]=useState<Set<number>>(()=>initialSet(key));
 const update=useCallback((next:Set<number>)=>{setItems(new Set(next));try{localStorage.setItem('hisui-v3-'+key,JSON.stringify([...next]))}catch{/* private mode */}},[key]);
 return [items,update] as const;
}
function downloadCSV(pokes:Pokemon[],caught:Set<number>,starred:Set<number>,team:Set<number>){
 const rows=[['Hisui Dex','Name','Types','Investment grade','Recommended final form','Best Nature','Rarity','Evolution','Where to obtain','Caught','Starred','Team']];
 for(const p of pokes){const grade=investGrade(p);rows.push([String(p.dex),p.name,p.type,grade.grade,grade.target,NATURES[natures(p)[0]]?.[0]||'',rarity(p),evolution(p),obtain(p),caught.has(p.dex)?'Yes':'No',starred.has(p.dex)?'Yes':'No',team.has(p.dex)?'Yes':'No'])}
 const csv=rows.map(cols=>cols.map(s=>'"'+String(s).replaceAll('"','""')+'"').join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download='Hisui_Pokedex_242.csv';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const fallback:Pokemon[]=DEX_NAMES.map((name:string,i:number)=>({dex:i+1,name,id:0,type:'',evolution:'Data loads on first connection',locations:'Connect to view encounters',stats:[],limited:true}));
export default function App(){
 const [pokes,setPokes]=useState<Pokemon[]>(fallback),[loaded,setLoaded]=useState(false),[error,setError]=useState('');
 const [view,setView]=useState<'dex'|'team'>('dex');
 const [caught,setCaught]=useStoredSet('caught'),[starred,setStarred]=useStoredSet('starred'),[team,setTeam]=useStoredSet('team');
 const [selectedDex,setSelectedDex]=useState<number|null>(()=>{const match=/^#pokemon-(\d{1,3})$/.exec(location.hash);return match?Number(match[1]):null});
 const selected=useMemo(()=>pokes.find(p=>p.dex===selectedDex)||null,[pokes,selectedDex]);
 const changeTeam=useCallback((ids:Set<number>)=>{if(ids.size>6){setError('A team can contain at most six Pokémon.');return}setTeam(ids)},[setTeam]);
 const select=(dex:number)=>{setSelectedDex(dex);history.replaceState(null,'','#pokemon-'+dex)};
 const close=()=>{setSelectedDex(null);if(location.hash.startsWith('#pokemon-'))history.replaceState(null,'',location.pathname+location.search)};
 const goToPokedex=()=>{close();setView('dex');window.scrollTo({top:0,behavior:'smooth'})};
 const toggle=(dex:number,items:Set<number>,update:(next:Set<number>)=>void)=>{const next=new Set(items);next.has(dex)?next.delete(dex):next.add(dex);update(next)};
 const toggleTeam=(dex:number)=>{const next=new Set(team);if(next.has(dex))next.delete(dex);else if(next.size>=6){setError('Your team already has six Pokémon.');return}else next.add(dex);changeTeam(next)};
 useEffect(()=>{
  let cancelled=false;
  Promise.all([fetchText(DATA_SOURCES.pokemon),fetchText(DATA_SOURCES.stats)]).then(([json,csv]:[string,string])=>{
   const entries=JSON.parse(json).pokemon;
   if(!Array.isArray(entries)||entries.length!==242)throw new Error('Expected 242 Hisui Pokémon');
   const stats=parseCSV(csv);
   const all:Pokemon[]=entries.map((item:{id:number;name:string;type:string;locations:string;evolution:string},index:number)=>({
    dex:index+1,id:+item.id,name:item.name,type:item.type,evolution:item.evolution,locations:item.locations,stats:getStats(stats,item),limited:false
   }));
   if(!cancelled){setInvestCatalog(all);setPokes(all);setLoaded(true)}
  }).catch(()=>{if(!cancelled)setError('Could not fetch Pokémon datasets. The basic 242-name index remains available; connect to the internet and refresh to load stats, evolutions and locations.')});
  return ()=>{cancelled=true};
 },[]);
 useEffect(()=>{const callback=()=>{const match=/^#pokemon-(\d{1,3})$/.exec(location.hash);setSelectedDex(match?Number(match[1]):null)};window.addEventListener('hashchange',callback);return ()=>window.removeEventListener('hashchange',callback)},[]);
 return <div className="app-shell">
  <header className="site-header"><button type="button" className="brand brand-home" onClick={goToPokedex} aria-label="Return to Hisui Pokédex"><span className="brand-mark" aria-hidden="true"><span className="brand-glyph">◈</span></span><span className="brand-copy"><span className="eyebrow">THE COLLECTOR'S FIELD GUIDE</span><span className="brand-title">Hisui Pokédex</span><span className="brand-tagline">Find it. Evolve it. Keep the right Nature.</span></span></button>
  <nav className="top-nav" aria-label="Main navigation">
   <Button variant={view==='dex'?'filled':'light'} onClick={goToPokedex} aria-label="Back to Pokédex">← Back to Pokédex</Button>
   <Button variant={view==='team'?'filled':'light'} onClick={()=>{close();setView('team')}}>◇ Team Lab {team.size}/6</Button>
  </nav></header>
  <section className="hero-banner"><div><span className="eyebrow">POKÉMON LEGENDS: ARCEUS</span><h2>Every Hisui Pokémon, one decision-friendly guide.</h2><p>Explore Natures, investment grades, evolutions, locations and explainable team recommendations.</p></div><div className="hero-numbers"><div><b>{pokes.length}</b><small>Hisui Pokémon</small></div><div><b>{caught.size}</b><small>Caught</small></div><div><b>{team.size}/6</b><small>Your team</small></div></div></section>
  {error&&<Alert color="orange" withCloseButton onClose={()=>setError('')} mb="md">{error}</Alert>}
  {view==='dex'?<div className="dex-layout"><PokemonTable pokes={pokes} loaded={loaded} caught={caught} starred={starred} team={team} onSelect={select} onStar={id=>toggle(id,starred,setStarred)} onExport={()=>downloadCSV(pokes,caught,starred,team)}/>
   <PokemonDetails pokemon={selected} all={pokes} caught={caught} starred={starred} team={team} onClose={close} onSelect={select} onCaught={id=>toggle(id,caught,setCaught)} onStar={id=>toggle(id,starred,setStarred)} onTeam={toggleTeam}/></div>:
   <TeamLab pokes={pokes} loaded={loaded} team={team} caught={caught} onTeamChange={changeTeam} onInspect={dex=>{setView('dex');select(dex)}}/>}
  <footer className="site-footer">Unofficial fan-made field guide. Pokémon is the property of its respective rights holders. Team recommendations, rarity and investment grades are approximate. Game data from <a href="https://github.com/Insektaure/pkDex" target="_blank" rel="noreferrer">pkDex</a> and <a href="https://github.com/lgreski/pokemonData" target="_blank" rel="noreferrer">PokémonData</a>. Browser progress is stored locally.</footer>
 </div>;
}
