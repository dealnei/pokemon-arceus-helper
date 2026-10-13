import type {Pokemon} from '../types';
import {ACQUIRE,rarity} from '../data/legacy';
import {getEncounterPlaces} from '../data/hisuiMaps';

export default function PokemonLocations({pokemon}:{pokemon:Pokemon}){
 const note=(ACQUIRE as Record<number,string>)[pokemon.dex];
 const entries=getEncounterPlaces(pokemon,note);
 return <section className="details-section" aria-label="Where to obtain">
  <h3>Where to obtain</h3>
  {note&&<p className="location-acquisition-note">{note}</p>}
  {entries.length?
   <ul className="location-list">
    {entries.map((entry,i)=><li key={entry.label+'-'+i}>
     {entry.mapUrl?<a className="location-link" href={entry.mapUrl} target="_blank" rel="noopener noreferrer"
       aria-label={`Open interactive regional map for ${entry.label} (new tab)`}
       title={entry.region?`View ${entry.region} interactive map (not an exact spawn pin)`:'Browse external Hisui interactive maps'}>
       <span aria-hidden="true" className="location-pin">⌖</span>
       <span className="location-copy"><strong>{entry.label}</strong>
        <small>{entry.region||'Browse Hisui maps'}</small></span>
       <span aria-hidden="true" className="location-map-action">Map ↗</span>
      </a>:
      <div className="location-method">
       <span aria-hidden="true" className="location-pin">✦</span>
       <span className="location-copy"><strong>{entry.label}</strong><small>Special method · no fixed map location</small></span>
      </div>}
    </li>)}
   </ul>:
   <p className="note-box">No encounter location is listed. Check evolution requirements and story progression.</p>}
  <p className="location-map-footnote">Links open external <strong>regional maps</strong>, not verified individual Pokémon spawn pins. Some map features may require an account.</p>
  <small className="hint">Estimated encounter rarity: {rarity(pokemon)}.</small>
 </section>;
}
