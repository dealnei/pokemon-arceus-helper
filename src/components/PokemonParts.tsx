import type {CSSProperties} from 'react';
import type {Pokemon} from '../types';
import {investGrade,TYPE_COLORS,sprite} from '../data/legacy';
export function GradeBadge({pokemon}:{pokemon:Pokemon}){
 const grade=investGrade(pokemon);
 return <span className={'grade-badge rank-'+grade.grade} title={grade.summary+' · '+grade.action}>{grade.grade}</span>;
}
export function TypeBadges({pokemon}:{pokemon:Pokemon}){
 return <span className="type-badges">{(pokemon.type||'Unknown').split(' / ').map(type=><span className="type-badge" key={type} style={{'--type-color':TYPE_COLORS[type]||'#b4aca3'} as CSSProperties}>{type}</span>)}</span>;
}
export function PokemonAvatar({pokemon,size=48}:{pokemon:Pokemon;size?:number}){
 return pokemon.id?<img className="pokemon-art" src={sprite(pokemon)} width={size} height={size} loading="lazy" alt={pokemon.name+' sprite'} onError={event=>{event.currentTarget.style.visibility='hidden'}}/>:<span className="art-placeholder" style={{width:size,height:size}}>{pokemon.name.charAt(0)}</span>;
}
