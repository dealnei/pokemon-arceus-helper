import {useMemo,useState} from 'react';
import {Button,TextInput,Select,ActionIcon} from '@mantine/core';
import type {Pokemon} from '../types';
import {NATURES,TYPE_COLORS,INVEST_SCALE,investGrade,natures,rarity,obtain,sortRarity,isEvolutionOnly} from '../data/legacy';
import {PokemonAvatar,TypeBadges,GradeBadge} from './PokemonParts';
type Props={pokes:Pokemon[];caught:Set<number>;starred:Set<number>;team:Set<number>;loaded:boolean;onSelect:(dex:number)=>void;onStar:(dex:number)=>void;onExport:()=>void};
type Col='dex'|'name'|'type'|'investment'|'rarity'|'nature'|'location'|'starred';
const columns:{key:Col;title:string;placeholder:string}[]=[
 {key:'dex',title:'#',placeholder:'1–40 or >=100'},{key:'name',title:'Pokémon',placeholder:'Name…'},{key:'type',title:'Type',placeholder:'All types'},
 {key:'investment',title:'Grade',placeholder:'S–F'},{key:'rarity',title:'Availability',placeholder:'Rarity'},
 {key:'nature',title:'Best Natures',placeholder:'Nature'},{key:'location',title:'Where to obtain',placeholder:'Location…'},{key:'starred',title:'★',placeholder:'Favorites'}
];
const empty:Record<Col,string>={dex:'',name:'',type:'',investment:'',rarity:'',nature:'',location:'',starred:''};
const fieldOptions:Partial<Record<Col,{value:string;label:string}[]>>={
 type:Object.keys(TYPE_COLORS).map(value=>({value,label:value})),
 investment:['S','A','B','C','D','F'].map(value=>({value,label:value})),
 rarity:['Common','Uncommon','Rare','Very rare','Unique'].map(value=>({value,label:value})),
 nature:Object.keys(NATURES).map(value=>({value,label:NATURES[value][0]+' ('+value+')'})),
 starred:[{value:'yes',label:'★ Only favorites'},{value:'no',label:'☆ Not starred'}]
};
function numberMatches(input:string,n:number){
 if(!input.trim())return true;
 const range=/^(\d{1,3})\s*[-–]\s*(\d{1,3})$/.exec(input);
 if(range)return n>=Math.min(+range[1],+range[2])&&n<=Math.max(+range[1],+range[2]);
 const comparison=/^(<=|>=|<|>)\s*(\d{1,3})$/.exec(input);
 if(comparison){const v=+comparison[2];return comparison[1]==='<'?n<v:comparison[1]==='>'?n>v:comparison[1]==='<='?n<=v:n>=v}
 return /^\d{1,3}$/.test(input)&&n===Number(input);
}
function sortValue(p:Pokemon,key:Col,starred:Set<number>):string|number{
 switch(key){
 case 'dex':return p.dex;case 'name':return p.name;case 'type':return p.type;
 case 'investment':return (INVEST_SCALE as Record<string,number>)[investGrade(p).grade]??0;case 'rarity':return sortRarity(rarity(p));
 case 'nature':return NATURES[natures(p)[0]]?.[0]||'';case 'location':return obtain(p);
 case 'starred':return Number(starred.has(p.dex));
 }
}
export default function PokemonTable({pokes,caught,starred,team,loaded,onSelect,onStar,onExport}:Props){
 const [filters,setFilters]=useState(empty),[search,setSearch]=useState(''),[sort,setSort]=useState<Col>('dex'),[direction,setDirection]=useState<1|-1>(1);
 const [chip,setChip]=useState<'all'|'favorite'|'team'|'uncaught'>('all');
 const change=(key:Col,value:string)=>setFilters(prev=>({...prev,[key]:value}));
 const list=useMemo(()=>{
  const q=search.trim().toLowerCase();
  return pokes.filter(p=>{
   if(filters.dex&&!numberMatches(filters.dex,p.dex))return false;
   if(filters.name&&!p.name.toLowerCase().includes(filters.name.toLowerCase()))return false;
   if(filters.type&&!p.type.split(' / ').includes(filters.type))return false;
   if(filters.investment&&investGrade(p).grade!==filters.investment)return false;
   if(filters.rarity&&rarity(p)!==filters.rarity)return false;
   if(filters.nature&&!natures(p).includes(filters.nature))return false;
   if(filters.location&&!obtain(p).toLowerCase().includes(filters.location.toLowerCase()))return false;
   if(filters.starred==='yes'&&!starred.has(p.dex)||filters.starred==='no'&&starred.has(p.dex))return false;
   if(chip==='favorite'&&!starred.has(p.dex)||chip==='team'&&!team.has(p.dex)||chip==='uncaught'&&caught.has(p.dex))return false;
   if(!q)return true;
   return [p.name,p.dex,p.type,p.locations,p.evolution,rarity(p),investGrade(p).grade,obtain(p),...natures(p).map((n:string)=>NATURES[n]?.[0]||n)].join(' ').toLowerCase().includes(q);
  }).sort((a,b)=>{
    const aa=sortValue(a,sort,starred),bb=sortValue(b,sort,starred);
    const diff=typeof aa==='number'&&typeof bb==='number'?aa-bb:String(aa).localeCompare(String(bb),undefined,{numeric:true,sensitivity:'base'});
    return diff*direction||a.dex-b.dex;
  });
 },[pokes,filters,search,sort,direction,starred,team,caught,chip]);
 const setSorting=(key:Col)=>{if(key===sort)setDirection(v=>v===1?-1:1);else {setSort(key);setDirection(['investment','rarity','starred'].includes(key)?-1:1)}};
 return <section className="pokedex-panel"><div className="dex-toolbar">
   <TextInput aria-label="Search all Pokédex columns" placeholder="⌕  Search all 242 Pokémon, places and evolutions…" value={search} onChange={e=>setSearch(e.currentTarget.value)}/>
   <Select aria-label="Choose sorting column" data={columns.map(c=>({value:c.key,label:c.title==='★'?'Favorites':c.title}))} value={sort} onChange={value=>value&&setSorting(value as Col)}/>
   <Button variant="light" onClick={()=>setDirection(v=>v===1?-1:1)}>{direction===1?'↑ Asc':'↓ Desc'}</Button>
   <Button variant="subtle" onClick={()=>{setFilters({...empty});setSearch('');setChip('all');setSort('dex');setDirection(1)}}>Reset</Button>
 </div><div className="chips">{(['all','favorite','team','uncaught'] as const).map(key=><Button key={key} size="xs" variant={chip===key?'filled':'light'} onClick={()=>setChip(key)}>{({all:'All Pokémon',favorite:'★ Favorites',team:'◇ My team',uncaught:'◯ Uncaught'})[key]}</Button>)}
 <span className="results">{list.length} / 242 Pokémon {loaded?'':'· loading details'}</span></div>
 <div className="dex-export">
   <div className="dex-export-description">
    <strong>Export your Pokédex</strong>
    <small>All 242 Pokémon with Natures, grades, locations, and your caught, favorites and team status. Filters don't affect the download.</small>
   </div>
   <Button size="xs" variant="light" leftSection={<span aria-hidden="true">↓</span>} onClick={onExport}>Download full Pokédex (.csv)</Button>
 </div>
 <div className="pokedex-scroll" role="region" aria-label="Sortable and filterable Pokédex" tabIndex={0}><table className="pokedex-table"><thead><tr>{columns.map(col=><th key={col.key} aria-sort={col.key===sort?(direction===1?'ascending':'descending'):'none'}><button className={'table-sort'+(col.key===sort?' active':'')} onClick={()=>setSorting(col.key)}>{col.title} <span aria-hidden="true">{col.key===sort?(direction===1?'↑':'↓'):'↕'}</span></button></th>)}</tr>
 <tr className="column-filters">{columns.map(col=><th key={col.key}>{fieldOptions[col.key]?<select aria-label={'Filter by '+col.title} value={filters[col.key]} onChange={e=>change(col.key,e.currentTarget.value)}><option value="">{col.placeholder}</option>{fieldOptions[col.key]!.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select>:
 <input aria-label={'Filter by '+col.title} type="search" placeholder={col.placeholder} value={filters[col.key]} onChange={e=>change(col.key,e.currentTarget.value)}/>}</th>)}</tr></thead>
 <tbody>{list.map(p=><tr key={p.dex} tabIndex={0} onClick={()=>onSelect(p.dex)} onKeyDown={e=>{if(e.key==='Enter')onSelect(p.dex)}} aria-label={'Open details for '+p.name}>
  <td className="dex-index">{String(p.dex).padStart(3,'0')}</td><td><div className="table-pokemon"><PokemonAvatar pokemon={p}/><span><b>{p.name}{caught.has(p.dex)&&' ✓'}{team.has(p.dex)&&' ◇'}</b><small>{p.id?'National #'+p.id:'Hisui'}</small></span></div></td>
  <td><TypeBadges pokemon={p}/></td><td><GradeBadge pokemon={p}/></td><td><span className="rarity-pill">{rarity(p)}</span><small className="row-mini">{isEvolutionOnly(p)?'Evolution only':'Approximate'}</small></td>
  <td><b className="best-nature">{NATURES[natures(p)[0]]?.[0]||'—'}</b><small className="row-mini">{natures(p).slice(1).map((n:string)=>NATURES[n]?.[0]||n).join(' · ')}</small></td>
  <td><span className="where-text">{obtain(p)}</span></td>
  <td><ActionIcon aria-label={'Favorite '+p.name} size="lg" variant="subtle" onClick={e=>{e.stopPropagation();onStar(p.dex)}}>{starred.has(p.dex)?'★':'☆'}</ActionIcon></td>
 </tr>)}</tbody></table>{!list.length&&<div className="empty-results">No matches. Try clearing one or more filters.</div>}</div></section>;
}
