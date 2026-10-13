import type {Pokemon} from '../types';

// Region links are external interactive maps. No exact Pokémon spawn marker or
// GPS coordinate is claimed by our Hisui Pokédex data.
const ROOT='https://www.gamerguides.com/pokemon-legends-arceus/maps/';
export const REGION_MAPS={
 'Obsidian Fieldlands':ROOT+'obsidian-fieldlands',
 'Crimson Mirelands':ROOT+'crimson-mirelands',
 'Cobalt Coastlands':ROOT+'cobalt-coastlands',
 'Coronet Highlands':ROOT+'coronet-highlands',
 'Alabaster Icelands':ROOT+'alabaster-icelands',
 'Jubilife Village':ROOT+'jubilife-village'
} as const;
export const MAP_DIRECTORY=ROOT;
export type Region=keyof typeof REGION_MAPS;

const SUBAREAS:Record<Region,string[]>={
 'Obsidian Fieldlands':[
  'Aspiration Hill','Deertrack Heights','Deertrack Path','Floaro Gardens',
  'Grandtree Arena','Grueling Grove','Horseshoe Plains','Lake Verity',
  'Nature’s Pantry','Obsidian Falls','Oreburrow Tunnel','Ramanas Island',
  'Sandgem Flats','The Heartwood','Tidewater Dam','Windswept Run','Worn Bridge'
 ],
 'Crimson Mirelands':[
  'Bolderoll Slope','Cloudpool Ridge','Cottonsedge Prairie','Diamond Heath',
  'Droning Meadow','Gapejaw Bog','Golden Lowlands','Holm of Trials',
  'Lake Valor','Scarlet Bog','Shrouded Ruins','Sludge Mound','Solaceon Ruins',
  "Ursa's Ring"
 ],
 'Cobalt Coastlands':[
  'Aipom Hill',"Bathers' Lagoon",'Castaway Shore','Coastlands Camp',
  'Crossing Slope','Deadwood Haunt','Firespit Island','Ginkgo Landing',
  'Hideaway Bay','Islespy Shore',"Lunker's Lair","Sand's Reach",
  'Seagrass Haven','Seaside Hollow','Spring Path','Tombolo Walk',
  'Tranquility Cove','Turnback Cave','Veilstone Cape','Windbreak Stand'
 ],
 'Coronet Highlands':[
  'Ancient Quarry','Bolderoll Ravine','Celestica Ruins','Celestica Trail',
  'Clamberclaw Cliffs','Cloudcap Pass','Fabled Spring','Heavenward Lookout',
  'Lonely Spring','Moonview Arena','Primeval Grotto','Sacred Plaza',
  'Sonorous Path','Stonetooth Rows','Temple of Sinnoh','Wayward Cave',
  'Wayward Wood'
 ],
 'Alabaster Icelands':[
  "Arena's Approach",'Avalanche Slopes',"Avalugg's Legacy",
  'Bonechill Wastes','Glacier Terrace',"Heart's Crag",'Ice Column Chamber',
  'Icebound Falls','Lake Acuity','Snowfall Hot Spring','Snowpoint Temple',
  'Whiteout Valley'
 ],
 'Jubilife Village':['Jubilife Village']
};

function normalise(value:string):string{
 return value.normalize('NFKC').replace(/[’‘]/g,"'").toLowerCase().trim();
}
const REGION_BY_AREA=new Map<string,Region>();
for(const [region,areas] of Object.entries(SUBAREAS) as [Region,string[]][])
 for(const label of [region,...areas]){
  const key=normalise(label);
  if(REGION_BY_AREA.has(key)&&REGION_BY_AREA.get(key)!==region)throw Error('Ambiguous area: '+label);
  REGION_BY_AREA.set(key,region);
 }
export type EncounterPlace={
 label:string;
 region:Region|null;
 mapUrl:string|null;
 kind:'place'|'special'|'method';
};
const regionFor=(label:string):Region|null=>
 REGION_BY_AREA.get(normalise(label.replace(/\s*\([^)]*\)\s*$/, '')))||null;

function mentionedRegions(notes:string):Region[]{
 const text=normalise(notes);
 return (Object.keys(REGION_MAPS) as Region[]).filter(region=>text.includes(normalise(region)));
}
function namedPlacesInNotes(notes:string):EncounterPlace[]{
 const entries:EncounterPlace[]=[];
 // These are explicit named places; we do not infer coordinates or spawn positions.
 for(const [region,areas] of Object.entries(SUBAREAS) as [Region,string[]][])
  for(const area of areas){
   const norm=normalise(area);
   if(normalise(notes).includes(norm)){
    entries.push({label:area,region,mapUrl:REGION_MAPS[region],kind:'place'});
   }
  }
 return entries;
}
export function getEncounterPlaces(pokemon:Pokemon,acquisitionNote=''):EncounterPlace[]{
 const labels=(pokemon.locations||'').split(',').map(s=>s.trim()).filter(s=>s&&s!=='-');
 const regions=mentionedRegions(acquisitionNote);
 const all:EncounterPlace[]=[];
 for(const label of labels){
  const region=regionFor(label);
  if(region){
   all.push({label,region,mapUrl:REGION_MAPS[region],kind:'place'});
  }else if(/^space[- ]time distortions?$/i.test(label)){
   if(regions.length){
    for(const r of regions)all.push({label:r+' · space-time distortion',region:r,mapUrl:REGION_MAPS[r],kind:'special'});
   }else{
    all.push({label,region:null,mapUrl:MAP_DIRECTORY,kind:'special'});
   }
  }else if(/^(?:evolve\b|massive mass outbreaks\b|complete\b|check evolution\b)/i.test(label)){
   all.push({label,region:null,mapUrl:null,kind:'method'});
  }else{
   // Conservative fallback. The region directory is safer than a wrong area map.
   all.push({label,region:null,mapUrl:MAP_DIRECTORY,kind:'special'});
  }
 }
 // A limited number of Pokémon have only an evolution / event descriptor in the
 // upstream data, while their acquisition notes include named locations.
 if(!all.some(e=>e.region)&&/\b(?:find|encounter|appears?|visit|quest|distortion)\b/i.test(acquisitionNote)){
  const places=namedPlacesInNotes(acquisitionNote);
  if(places.length)all.push(...places);
  else for(const region of regions)
   all.push({label:region+( /distortion/i.test(acquisitionNote)?' · space-time distortion':''),region,mapUrl:REGION_MAPS[region],kind:'special'});
 }
 if(!all.length&&acquisitionNote.trim()){
  all.push({label:acquisitionNote.trim(),region:null,mapUrl:null,kind:'method'});
 }
 return all.filter((entry,i)=>all.findIndex(e=>normalise(e.label)===normalise(entry.label))===i);
}
