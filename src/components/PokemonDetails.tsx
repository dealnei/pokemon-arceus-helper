import {useEffect,useRef} from 'react';
import {Button,Drawer,ScrollArea} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import type {Pokemon} from '../types';
import {natures,NATURES,investGrade} from '../data/legacy';
import PokemonLocations from './PokemonLocations';
import {PokemonAvatar,GradeBadge,TypeBadges} from './PokemonParts';
import EvolutionChain from './EvolutionChain';
type Props={pokemon:Pokemon|null;all:Pokemon[];caught:Set<number>;starred:Set<number>;team:Set<number>;onClose:()=>void;onSelect:(id:number)=>void;onCaught:(id:number)=>void;onStar:(id:number)=>void;onTeam:(id:number)=>void};
export default function PokemonDetails(props:Props){
 const {pokemon,onClose}=props;
 const mobile=useMediaQuery('(max-width: 900px)');
 const viewport=useRef<HTMLDivElement>(null);
 useEffect(()=>{viewport.current?.scrollTo({top:0})},[pokemon?.dex]);
 const contents=pokemon?<DetailBody {...props} pokemon={pokemon}/>:<div className="detail-empty">Select a Pokémon to inspect its Nature, evolution chain, team grade and habitat.</div>;
 if(mobile)return <Drawer opened={!!pokemon} onClose={onClose} position="bottom" size="92dvh" title={pokemon?'Hisui #'+String(pokemon.dex).padStart(3,'0')+' · '+pokemon.name:'Pokémon details'} classNames={{content:'hisui-drawer',header:'hisui-drawer-header',body:'hisui-drawer-body'}} overlayProps={{backgroundOpacity:.6,blur:2}}>
  <ScrollArea h="calc(92dvh - 76px)" type="scroll" viewportRef={viewport} offsetScrollbars scrollbarSize={8}>{contents}</ScrollArea>
 </Drawer>;
 return <aside className="details-panel" aria-label="Pokémon details"><header className="details-panel-head"><span>HISUI FIELD NOTES</span><b>{pokemon?'#'+String(pokemon.dex).padStart(3,'0'):'SELECT A POKÉMON'}</b></header>
  <ScrollArea className="details-panel-scroll" type="scroll" viewportRef={viewport} offsetScrollbars scrollbarSize={8}>{contents}</ScrollArea>
 </aside>;
}
function DetailBody({pokemon,all,caught,starred,team,onSelect,onCaught,onStar,onTeam}:Props&{pokemon:Pokemon}){
 const grade=investGrade(pokemon),nat=natures(pokemon) as string[];
 return <div className="details-body"><div className="details-art"><PokemonAvatar pokemon={pokemon} size={130}/><h2>{pokemon.name}</h2><TypeBadges pokemon={pokemon}/></div>
  <div className="grade-card"><GradeBadge pokemon={pokemon}/><div><strong>{grade.summary}</strong><small>{grade.action}</small></div></div>
  <p className="details-note">{grade.note} {grade.stageNote}</p>
  <div className="details-actions">
   <Button size="xs" variant={caught.has(pokemon.dex)?'filled':'light'} onClick={()=>onCaught(pokemon.dex)}>{caught.has(pokemon.dex)?'✓ Caught':'Mark caught'}</Button>
   <Button size="xs" variant={starred.has(pokemon.dex)?'filled':'light'} onClick={()=>onStar(pokemon.dex)}>{starred.has(pokemon.dex)?'★ Favorite':'☆ Favorite'}</Button>
   <Button size="xs" variant={team.has(pokemon.dex)?'filled':'light'} onClick={()=>onTeam(pokemon.dex)}>{team.has(pokemon.dex)?'◇ In team':'+ Add to team'}</Button>
  </div>
  <section className="details-section"><h3>Recommended Natures</h3><div className="nature-list">{nat.map((key,i)=>{const data=NATURES[key];return <div className="nature-row" key={key}><span>{i+1}</span><b>{data?.[0]||key}</b><small>{key} · +{data?.[1]||'?'} / −{data?.[2]||'?'}</small></div>})}</div></section>
  {pokemon.stats?.length===6&&<section className="details-section"><h3>Base stats</h3><div className="stats-grid">{['HP','Attack','Defense','Sp. Atk','Sp. Def','Speed'].map((name,i)=><div key={name}><small>{name}</small><b>{pokemon.stats[i]}</b></div>)}</div></section>}
  <EvolutionChain pokemon={pokemon} all={all} onSelect={onSelect}/>
  <PokemonLocations pokemon={pokemon}/>
  <p className="details-disclaimer">Investment grades are practical story-team estimates, not official Pokémon rankings.</p>
 </div>;
}
