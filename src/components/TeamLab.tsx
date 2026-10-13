import {useMemo,useState} from 'react';
import {Button,Checkbox,Select} from '@mantine/core';
import type {Pokemon,Strategy} from '../types';
import {investGrade,obtain,natures,NATURES} from '../data/legacy';
import {PLAYSTYLES,recommend,replacementIdeas,teamSnapshot,roleOf} from '../teamEngine';
import {GradeBadge,PokemonAvatar,TypeBadges} from './PokemonParts';
type Props={pokes:Pokemon[];team:Set<number>;caught:Set<number>;loaded:boolean;onTeamChange:(next:Set<number>)=>void;onInspect:(dex:number)=>void};
const strategies:Strategy[]=['balanced','offense','speed','defense','capture'];
export default function TeamLab({pokes,team,caught,loaded,onTeamChange,onInspect}:Props){
 const [style,setStyle]=useState<Strategy>('balanced');
 const [caughtOnly,setCaughtOnly]=useState(false),[allowLegendaries,setAllowLegendaries]=useState(false),[angle,setAngle]=useState(0);
 const [pick,setPick]=useState<string|null>(null),[feedback,setFeedback]=useState('');
 const members=useMemo(()=>[...team].map(id=>pokes[id-1]).filter(Boolean),[team,pokes]);
 const filters=useMemo(()=>({caughtOnly,allowLegendaries,caught}),[caughtOnly,allowLegendaries,caught]);
 const ideas=useMemo(()=>loaded&&members.length<6?recommend(members,pokes,filters,style,angle):[],[members,pokes,filters,style,angle,loaded]);
 const swaps=useMemo(()=>loaded&&members.length>=3?replacementIdeas(members,pokes,filters,style):[],[members,pokes,filters,style,loaded]);
 const report=useMemo(()=>loaded?teamSnapshot(members):null,[members,loaded]);
 const put=(dex:number)=>{if(team.has(dex))return;if(team.size>=6){setFeedback('Your team already contains six Pokémon. Swap or remove a teammate first.');return}onTeamChange(new Set([...team,dex]));setPick(null);setFeedback('Added to your team.')};
 const remove=(dex:number)=>{const copy=new Set(team);copy.delete(dex);onTeamChange(copy)};
 const swap=(from:number,to:number)=>{if(!team.has(from)||team.has(to))return;const next=[...team].map(id=>id===from?to:id);onTeamChange(new Set(next));setFeedback('Replacement applied. Recommendations updated.')};
 const complete=()=>{
  const built=new Set(team);
  for(let n=0;n<6&&built.size<6;n++){
   const subset=[...built].map(id=>pokes[id-1]).filter(Boolean);
   const next=recommend(subset,pokes,filters,style,0)[0];
   if(!next)break;
   built.add(next.p.dex);
  }
  onTeamChange(built);setFeedback('Team updated based on the '+PLAYSTYLES[style].name+' strategy.');
 };
 return <div className="lab-view">
  <section className="panel lab-heading"><div><span className="eyebrow">✦ YOUR HISUI STRATEGY STUDIO</span><h2>Build a better six.</h2><p>Combine Pokémon you like with type coverage, speed, survivability and capture utility.</p></div><Button disabled={!loaded||team.size>=6} onClick={complete}>✧ Complete my team</Button></section>
  <section className="metrics-grid">{[[members.length+'/6','Team slots'],[(report?.coverage?.size||0)+'/18','Super-effective STAB targets'],[report?.holes?.length||0,'Uncovered weaknesses'],[members.filter(p=>p.stats?.[5]>=100).length,'Fast members']].map(([n,label])=><div className="panel metric" key={label}><b>{n}</b><small>{label}</small></div>)}</section>
  <section className="lab-primary">
   <div className="panel"><div className="section-title"><div><span className="eyebrow">YOUR LINEUP</span><h3>Team slots ({team.size}/6)</h3></div><Button size="xs" variant="subtle" color="red" onClick={()=>onTeamChange(new Set())}>Clear all</Button></div>
    <div className="team-slots">{Array.from({length:6},(_,i)=>members[i]?<div className="team-slot" key={members[i].dex}><button className="remove-member" aria-label={'Remove '+members[i].name} onClick={()=>remove(members[i].dex)}>×</button><PokemonAvatar pokemon={members[i]} size={65}/><b>{members[i].name}</b><GradeBadge pokemon={members[i]}/><small>{roleOf(members[i])}</small></div>:<div className="team-slot empty" key={'empty'+i}><span className="plus">＋</span><small>Empty slot {i+1}</small></div>)}</div>
    <div className="team-picker"><Select searchable clearable label="Add a Pokémon" placeholder="Search all 242 species" value={pick} onChange={setPick} data={pokes.filter(p=>!team.has(p.dex)).map(p=>({value:String(p.dex),label:p.name}))} nothingFoundMessage="No matching Pokémon"/><Button disabled={!pick||team.size>=6} onClick={()=>pick&&put(+pick)}>＋ Add</Button></div>
    {feedback&&<p className="feedback" role="status">{feedback}</p>}
   </div>
   <div className="panel"><span className="eyebrow">HOW DO YOU WANT TO PLAY?</span><h3>Choose your strategy</h3><div className="strategy-list">{strategies.map(key=><button key={key} className={'strategy-button'+(style===key?' selected':'')} onClick={()=>{setStyle(key);setAngle(0)}}><b>{PLAYSTYLES[key].name}</b><small>{PLAYSTYLES[key].description}</small></button>)}</div><div className="strategy-options"><Checkbox checked={caughtOnly} onChange={e=>setCaughtOnly(e.currentTarget.checked)} label="Only suggest Pokémon marked caught"/><Checkbox checked={allowLegendaries} onChange={e=>setAllowLegendaries(e.currentTarget.checked)} label="Allow legendary and mythical Pokémon"/></div></div>
  </section>
  <section className="panel"><span className="eyebrow">LIVE ANALYSIS</span><h3>Team matchup report</h3>{!loaded?<p>Loading Pokémon base stats…</p>:!members.length?<p>Add Pokémon to reveal uncovered weaknesses, resistances and offensive coverage.</p>:<div className="threat-grid">{[['Uncovered weaknesses',report?.holes],['Covered weaknesses',report?.covered],['Defensive resistances',report?.resistant]].map(([label,entries])=><div className="threat-card" key={label as string}><b>{label as string}</b><div>{(entries as {t:string}[]||[]).slice(0,8).map(x=><span className="threat-tag" key={x.t}>{x.t}</span>)}{!(entries as object[]||[]).length&&<small>None detected</small>}</div></div>)}</div>}</section>
  <section className="panel"><span className="eyebrow">PARTY OPTIMIZATION</span><h3>Should anyone be replaced?</h3><p className="minor">Optional swaps compare the strategy score before and after, including new weaknesses and lost STAB coverage.</p>
  {!loaded?<p>Loading base stats…</p>:members.length<3?<p>Add at least three Pokémon for meaningful replacement suggestions.</p>:!swaps.length?<p>No clear upgrades found using your current strategy and filters.</p>:
  <div className="swap-grid">{swaps.map((item:{outgoing:Pokemon;incoming:Pokemon;reasons:string[];tradeoff:string})=><div className="suggest-card" key={item.outgoing.dex+'-'+item.incoming.dex}><div className="swap-comparison"><div><PokemonAvatar pokemon={item.outgoing} size={50}/><b>{item.outgoing.name}</b><small>Replace</small></div><span>→</span><div><PokemonAvatar pokemon={item.incoming} size={50}/><b>{item.incoming.name}</b><GradeBadge pokemon={item.incoming}/></div></div><ul>{item.reasons.map((reason:string)=><li key={reason}>{reason}</li>)}{item.tradeoff&&<li className="tradeoff">{item.tradeoff}</li>}</ul><Button size="sm" onClick={()=>swap(item.outgoing.dex,item.incoming.dex)}>↔ Swap Pokémon</Button></div>)}</div>}</section>
  <section><div className="suggestion-title"><div><span className="eyebrow">SMART RECOMMENDATIONS</span><h3>Who should join next?</h3></div><Button variant="light" onClick={()=>setAngle(v=>(v+1)%4)}>↻ New angle</Button></div>
  {!loaded?<div className="panel">Load data to enable Team Lab recommendations.</div>:members.length===6?<div className="panel">Your six slots are filled. Use the replacement suggestions above to explore upgrades.</div>:!ideas.length?<div className="panel">No eligible suggestions. Try changing filters.</div>:
  <div className="recommendation-grid">{ideas.map((item:{p:Pokemon;reason:string[];role:string})=><article className="panel recommendation" key={item.p.dex}><div className="rec-hero"><PokemonAvatar pokemon={item.p} size={82}/><div><small>HISUI #{String(item.p.dex).padStart(3,'0')}</small><h3>{item.p.name} <GradeBadge pokemon={item.p}/></h3><p>{item.role}</p><TypeBadges pokemon={item.p}/></div></div><ul>{item.reason.map((reason:string)=><li key={reason}>{reason}</li>)}</ul><small className="rec-meta">Nature: {NATURES[natures(item.p)[0]]?.[0]} · Find: {obtain(item.p)}</small><div className="rec-actions"><Button onClick={()=>put(item.p.dex)}>＋ Add to team</Button><Button variant="light" onClick={()=>onInspect(item.p.dex)}>Details ↗</Button></div></article>)}</div>}
  </section>
  <p className="lab-footnote">Recommendations are rules-based and use types, base stats, native-type coverage and selected strategy; they do not simulate movesets or battle turns.</p>
 </div>;
}
