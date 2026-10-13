import type {Pokemon} from '../types';
import {evolution,evolutionFamily} from '../data/legacy';
import {PokemonAvatar} from './PokemonParts';
export default function EvolutionChain({pokemon,all,onSelect}:{pokemon:Pokemon;all:Pokemon[];onSelect:(dex:number)=>void}){
 const family=evolutionFamily(pokemon,all) as Pokemon[];
 return <section className="details-section"><h3>Evolution family</h3>
  <div className="evolution-chain">{family.map(stage=><button type="button" className={'evo-stage'+(stage.dex===pokemon.dex?' current':'')} disabled={stage.dex===pokemon.dex} onClick={()=>onSelect(stage.dex)} key={stage.dex}>
   <PokemonAvatar pokemon={stage} size={40}/><span><b>{stage.name}</b><small>Hisui #{String(stage.dex).padStart(3,'0')}</small></span><span className="evo-link">{stage.dex===pokemon.dex?'Current':'View ↗'}</span>
  </button>)}</div>
  <h3>How to evolve</h3><p className="note-box">{evolution(pokemon)}</p>
 </section>
}
