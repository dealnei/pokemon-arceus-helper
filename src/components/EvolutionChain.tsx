import type {Pokemon} from '../types';
import {evolutionFamily,EXTRA_METHODS} from '../data/legacy';
import {getEvolutionSteps} from '../data/evolutionSteps';
import {PokemonAvatar} from './PokemonParts';

type Props={pokemon:Pokemon;all:Pokemon[];onSelect:(dex:number)=>void};

export default function EvolutionChain({pokemon,all,onSelect}:Props){
 const family=evolutionFamily(pokemon,all) as Pokemon[];
 const steps=getEvolutionSteps(pokemon);
 const note=(EXTRA_METHODS as Record<number,string>)[pokemon.dex];
 return <section className="details-section" aria-label="Evolution family">
  <h3>Evolution family</h3>
  {family.length>0&&<div className="evolution-chain">{family.map(stage=>
   <button type="button" className={'evo-stage'+(stage.dex===pokemon.dex?' current':'')}
    disabled={stage.dex===pokemon.dex} onClick={()=>onSelect(stage.dex)} key={stage.dex}>
    <PokemonAvatar pokemon={stage} size={40}/>
    <span><b>{stage.name}</b><small>Hisui #{String(stage.dex).padStart(3,'0')}</small></span>
    <span className="evo-link">{stage.dex===pokemon.dex?'Current':'View →'}</span>
   </button>
  )}</div>}
  <h3>How to evolve</h3>
  {steps.length>0?<ol className="evo-steps">{steps.map(step=>{
   const target=all.find(p=>p.name.toLowerCase()===step.to.toLowerCase());
   return <li key={step.from+'-'+step.to} className="evo-method-row">
    <span className="evo-step-icon" aria-hidden="true">↗</span>
    <div className="evo-step-content">
     <span className="evo-step-names">
      <span>{step.from}</span><span aria-hidden="true">→</span>
      {target?<button type="button" className="evo-target" onClick={()=>onSelect(target.dex)} title={`View ${target.name} in this Pokédex`}>{step.to}</button>:<b>{step.to}</b>}
     </span>
     <span className="evo-step-requirement">{step.requirement}</span>
    </div>
    <a className="evo-guide-link" href={step.guideUrl} target="_blank" rel="noopener noreferrer"
       aria-label={`Read external evolution details for ${step.to} (new tab)`}
       title={`Read ${step.to} evolution details on Serebii`}>Guide ↗</a>
   </li>;
  })}</ol>:<p className="note-box">This Pokémon does not evolve.</p>}
  {note&&pokemon.dex!==25&&<p className="evo-extra-note">{note}</p>}
  <p className="evo-footnote">Select a Pokémon to view it here, or open its external Generation VIII guide for further evolution details. In Legends: Arceus, eligible level-based evolutions must be triggered manually.</p>
 </section>;
}
