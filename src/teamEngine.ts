// @ts-nocheck
// Rules-based PLA team recommendations, extracted from the original site.
// No document access: callers explicitly pass teammates and eligible species.
import {TYPE_COLORS,INVEST_SCALE,investGrade} from './data/legacy';
const TEAM_MATCHUPS={
 Normal:{Rock:.5,Ghost:0,Steel:.5},Fire:{Fire:.5,Water:.5,Grass:2,Ice:2,Bug:2,Rock:.5,Dragon:.5,Steel:2},
 Water:{Fire:2,Water:.5,Grass:.5,Ground:2,Rock:2,Dragon:.5},Electric:{Water:2,Electric:.5,Grass:.5,Ground:0,Flying:2,Dragon:.5},
 Grass:{Fire:.5,Water:2,Grass:.5,Poison:.5,Ground:2,Flying:.5,Bug:.5,Rock:2,Dragon:.5,Steel:.5},
 Ice:{Fire:.5,Water:.5,Grass:2,Ice:.5,Ground:2,Flying:2,Dragon:2,Steel:.5},
 Fighting:{Normal:2,Ice:2,Poison:.5,Flying:.5,Psychic:.5,Bug:.5,Rock:2,Ghost:0,Dark:2,Steel:2,Fairy:.5},
 Poison:{Grass:2,Poison:.5,Ground:.5,Rock:.5,Ghost:.5,Steel:0,Fairy:2},
 Ground:{Fire:2,Electric:2,Grass:.5,Poison:2,Flying:0,Bug:.5,Rock:2,Steel:2},
 Flying:{Electric:.5,Grass:2,Fighting:2,Bug:2,Rock:.5,Steel:.5},
 Psychic:{Fighting:2,Poison:2,Psychic:.5,Dark:0,Steel:.5},
 Bug:{Fire:.5,Grass:2,Fighting:.5,Poison:.5,Flying:.5,Psychic:2,Ghost:.5,Dark:2,Steel:.5,Fairy:.5},
 Rock:{Fire:2,Ice:2,Fighting:.5,Ground:.5,Flying:2,Bug:2,Steel:.5},
 Ghost:{Normal:0,Psychic:2,Ghost:2,Dark:.5},
 Dragon:{Dragon:2,Steel:.5,Fairy:0},Dark:{Fighting:.5,Psychic:2,Ghost:2,Dark:.5,Fairy:.5},
 Steel:{Fire:.5,Water:.5,Electric:.5,Ice:2,Rock:2,Steel:.5,Fairy:2},
 Fairy:{Fire:.5,Fighting:2,Poison:.5,Dragon:2,Dark:2,Steel:.5}
};
const ALL_TYPES=Object.keys(TYPE_COLORS);
const PLAYSTYLES={balanced:{name:'Balanced',description:'A physical/special mix, answers to team weaknesses, and a reliable defensive backbone.'},offense:{name:'High damage',description:'Powerful attackers with distinct STAB types to remove targets quickly.'},speed:{name:'Quick turns',description:'High base Speed and varied matchups, useful for acting sooner.'},defense:{name:'Survivability',description:'More durable teammates and safer resistance coverage for tough encounters.'},capture:{name:'Capture team',description:'Reliable catch support alongside enough attackers to complete the Pokédex.'}};
const CATCH_UTIL={Parasect:'Spore + False Swipe (Training Grounds)',Gallade:'Hypnosis + False Swipe (Training Grounds)',Paras:'Spore + False Swipe (after training)'};
const FALSE_SWIPE=new Set('Kleavor Decidueye Dartrix Rowlet Samurott Dewott Oshawott Gallade Gliscor Weavile Drapion Skorupi Garchomp Kricketune Sneasel Heracross Scizor Gligar Scyther Parasect Paras'.split(' '));

const pokemonTypes=p=>(p.type||'').split(' / ').filter(t=>ALL_TYPES.includes(t));
function matchup(a,p){return pokemonTypes(p).reduce((v,t)=>v*(TEAM_MATCHUPS[a]?.[t]??1),1)}
function allOffensiveTargets(list){const res=new Set();for(const p of list)for(const att of pokemonTypes(p))for(const d of ALL_TYPES)if((TEAM_MATCHUPS[att]?.[d]||1)>1)res.add(d);return res;}
function statsOf(p){const [hp=65,atk=70,def=70,spa=70,spd=70,spe=70]=p.stats||[];return {hp,atk,def,spa,spd,spe,power:Math.max(atk,spa),bulk:hp*.8+(def+spd)*.56,physical:atk>=spa*1.15,special:spa>=atk*1.15}}
function roleOf(p){if(CATCH_UTIL[p.name])return 'Capture specialist';const s=statsOf(p);if(s.bulk>205&&s.spe<85)return 'Defensive anchor';if(s.power>=105&&s.spe>=95)return s.special?'Fast special attacker':'Fast physical attacker';if(s.power>=105)return s.special?'Special attacker':'Physical attacker';if(s.spe>=108)return 'Speed specialist';if(s.bulk>=173)return 'Bulky support';return s.special?'Special attacker':s.physical?'Physical attacker':'Versatile attacker';}
function shareFamily(a,b){if(a.name===b.name)return true;const x=(a.evolution||''),y=(b.evolution||'');return x!=='-'&&x===y&&x.length>8&&a.name!=='Eevee'&&b.name!=='Eevee'}
function ratingOf(teamP,c,style){const old=teamP,arr=[...old,c],s=statsOf(c),quality=Math.min(620,s.hp+s.atk+s.def+s.spa+s.spd+s.spe),oTypes=new Set(old.flatMap(p=>pokemonTypes(p))),cTypes=pokemonTypes(c);let score=quality*.052+s.power*.105+({S:8,A:5,B:2,C:0,D:-3,F:-8}[investGrade(c).grade]||0),reason=[],tags=[];
 if(style==='offense')score+=s.power*.48+s.spe*.065;
 if(style==='speed')score+=s.spe*.53+s.power*.13;
 if(style==='defense')score+=s.bulk*.26+(s.def+s.spd)*.08;
 if(style==='balanced')score+=s.bulk*.11+s.spe*.09;
 if(style==='capture')score+=s.bulk*.065+s.spe*.07;
 const missingPhys=!old.some(p=>statsOf(p).physical),missingSpecial=!old.some(p=>statsOf(p).special);
 if(missingPhys&&s.physical){score+=8;reason.push('Adds a physical attacker to balance your damage.');}
 if(missingSpecial&&s.special){score+=9;reason.push('Adds special damage so your team is not purely physical.');}
 if(!old.some(p=>statsOf(p).bulk>=180)&&s.bulk>=180){score+=6;reason.push('Adds a bulkier option for difficult battles.');}
 if(!old.some(p=>statsOf(p).spe>=100)&&s.spe>=100){score+=6;reason.push('Adds a fast Pokémon that can help control action order.');}
 const fresh=cTypes.filter(t=>!oTypes.has(t));score+=fresh.length*5.5;
 if(fresh.length)reason.push(`Introduces ${fresh.join(' / ')}-type STAB coverage.`);
 const existing=allOffensiveTargets(old),newTargets=ALL_TYPES.filter(t=>!existing.has(t)&&cTypes.some(x=>(TEAM_MATCHUPS[x]?.[t]||1)>1));
 score+=Math.min(9,newTargets.length*1.6);if(newTargets.length)reason.push(`Can threaten ${newTargets.slice(0,3).join(', ')} types with super-effective STAB moves.`);
 const shields=ALL_TYPES.filter(t=>old.some(p=>matchup(t,p)>1)&&matchup(t,c)<1);
 score+=Math.min(23,shields.length*5.5);if(shields.length){reason.unshift(`Resists ${shields.slice(0,3).join(', ')} attacks that threaten a current teammate.`);tags.push('Protective switch-in')}
 const danger=ALL_TYPES.filter(t=>matchup(t,c)>1&&old.filter(p=>matchup(t,p)>1).length>=2&&!old.some(p=>matchup(t,p)<1));score-=Math.min(16,danger.length*3.5);
 const newWeak=ALL_TYPES.filter(t=>matchup(t,c)>1&&old.some(p=>matchup(t,p)>1)&&!old.some(p=>matchup(t,p)<1));score-=Math.min(12,newWeak.length*2.5);
 const overlaps=cTypes.filter(t=>oTypes.has(t)).length;score-=overlaps*4.3;
 if(old.some(p=>shareFamily(p,c)))score-=30;
 if(style==='capture'){
  if(CATCH_UTIL[c.name]&&!old.some(p=>CATCH_UTIL[p.name])){score+=56;reason.unshift(`${CATCH_UTIL[c.name]} helps weaken wild Pokémon and inflict drowsiness.`);tags.push('Catching utility');}
  else if(FALSE_SWIPE.has(c.name)&&!old.some(p=>FALSE_SWIPE.has(p.name))){score+=18;reason.push('Can learn False Swipe to leave targets with at least 1 HP.');tags.push('False Swipe');}
 }
 if(style==='speed'&&s.spe>=100)reason.push(`Base Speed ${s.spe} suits a quick-turn approach.`);
 if(style==='offense'&&s.power>=105)reason.push(`High base ${s.atk>s.spa?'Attack':'Sp. Attack'} (${s.power}) supports an aggressive team.`);
 if(style==='defense'&&s.bulk>=175)reason.push('Strong HP/defense profile supports longer battles.');
 if(!reason.length)reason.push('Adds another matchup option to diversify your party.');
 if(danger.length&&!shields.length)tags.push(`Watch ${danger[0]} weakness`);
 return {p:c,score,reason:reason.slice(0,3),role:roleOf(c),tags};
}

function getEligible(current,all,filters){
 const already=new Set(current.map(p=>p.dex));
 return all.filter(p=>!already.has(p.dex)&&pokemonTypes(p).length&&p.stats?.length===6
   &&(!filters.caughtOnly||filters.caught.has(p.dex))
   &&(filters.allowLegendaries||p.dex<225)
   &&!current.some(x=>shareFamily(x,p)));
}
function recommend(current,all,filters,labStyle,offset=0){const eligibleCandidates=c=>getEligible(c,all,filters);const sorted=eligibleCandidates(current).map(p=>ratingOf(current,p,labStyle)).sort((a,b)=>b.score-a.score||a.p.dex-b.p.dex);
 if(!sorted.length)return [];
 // Diversify the suggestions: avoid showing multiple lower-stage members of the same evolutionary line.
 const out=[];const used=new Set();const shifted=[...sorted.slice(offset*2),...sorted.slice(0,offset*2)];
 for(const x of shifted){const similar=out.some(y=>(y.p.evolution===x.p.evolution&&x.p.evolution!=='-'&&x.p.evolution.length>8));if(similar)continue;if(out.some(y=>y.p.type===x.p.type)&&out.length>=2)continue;if(!used.has(x.p.dex)){out.push(x);used.add(x.p.dex)}if(out.length>=6)break}
 return out;
}
function teamSnapshot(ts){const coverage=allOffensiveTargets(ts);
 const exposed=ALL_TYPES.map(t=>({t,weak:ts.filter(p=>matchup(t,p)>1).length,resist:ts.filter(p=>matchup(t,p)<1).length}));
 return {ts,coverage,exposed,holes:exposed.filter(x=>x.weak>0&&x.resist===0).sort((a,b)=>b.weak-a.weak||a.t.localeCompare(b.t)),covered:exposed.filter(x=>x.weak>0&&x.resist>0),resistant:exposed.filter(x=>x.weak===0&&x.resist>0)};
}

function openTeamGaps(members){
 return ALL_TYPES.filter(t=>members.some(p=>matchup(t,p)>1)&&!members.some(p=>matchup(t,p)<1));
}
function replacementIdeas(members,all,filters,labStyle){const eligibleCandidates=c=>getEligible(c,all,filters);
 if(members.length<3)return [];
 const oldGaps=openTeamGaps(members),oldCoverage=allOffensiveTargets(members),possibilities=[];
 for(const outgoing of members){
  const rest=members.filter(p=>p.dex!==outgoing.dex);
  const baseline=ratingOf(rest,outgoing,labStyle).score;
  const ranked=eligibleCandidates(rest).map(incoming=>({incoming,fit:ratingOf(rest,incoming,labStyle)}))
   .sort((a,b)=>b.fit.score-a.fit.score||a.incoming.dex-b.incoming.dex).slice(0,35);
  for(const {incoming,fit} of ranked){
   const newMembers=[...rest,incoming],newGaps=openTeamGaps(newMembers);
   const fixed=oldGaps.filter(t=>!newGaps.includes(t)),introduced=newGaps.filter(t=>!oldGaps.includes(t));
   const newCoverage=allOffensiveTargets(newMembers);
   const gained=[...newCoverage].filter(t=>!oldCoverage.has(t)),lost=[...oldCoverage].filter(t=>!newCoverage.has(t));
   const improvement=fit.score-baseline+fixed.length*5-introduced.length*7+gained.length*2-lost.length*3;
   if(improvement<14)continue;
   const before=statsOf(outgoing),after=statsOf(incoming),reasons=[];
   if(shareFamily(outgoing,incoming))reasons.push('An evolution-family upgrade with stronger base stats or a more suitable role.');
   if(fixed.length)reasons.push(`Closes uncovered ${fixed.slice(0,3).join(', ')} weakness${fixed.length===1?'':'es'} in your team.`);
   if(gained.length)reasons.push(`Adds potential super-effective STAB matchups against ${gained.slice(0,3).join(', ')}.`);
   if(labStyle==='speed'&&after.spe>=before.spe+15)reasons.push(`Raises base Speed from ${before.spe} to ${after.spe} for quicker turns.`);
   else if(labStyle==='offense'&&after.power>=before.power+12)reasons.push(`Boosts your strongest attacking stat from ${before.power} to ${after.power}.`);
   else if(labStyle==='defense'&&after.bulk>=before.bulk+18)reasons.push('Adds more bulk and survivability.');
   else if(labStyle==='capture'&&CATCH_UTIL[incoming.name]&&!CATCH_UTIL[outgoing.name])reasons.push(`Adds capture utility: ${CATCH_UTIL[incoming.name]}.`);
   if(!reasons.length)reasons.push(`Better fits your ${PLAYSTYLES[labStyle].name.toLowerCase()} plan based on base stats and team synergy.`);
   let tradeoff='';
   if(introduced.length)tradeoff=`Trade-off: introduces uncovered ${introduced.slice(0,2).join(', ')} weakness${introduced.length===1?'':'es'}.`;
   else if(lost.length)tradeoff=`Trade-off: loses STAB coverage against ${lost.slice(0,2).join(', ')}.`;
   else if(after.spe<before.spe-18)tradeoff='Trade-off: the replacement is slower.';
   else if(after.bulk<before.bulk-25)tradeoff='Trade-off: the replacement is less durable.';
   possibilities.push({outgoing,incoming,improvement,reasons:reasons.slice(0,3),tradeoff});
  }
 }
 possibilities.sort((a,b)=>b.improvement-a.improvement||a.outgoing.dex-b.outgoing.dex||a.incoming.dex-b.incoming.dex);
 const chosen=[],removed=new Set(),added=new Set();
 for(const option of possibilities){
  if(removed.has(option.outgoing.dex)||added.has(option.incoming.dex))continue;
  chosen.push(option);removed.add(option.outgoing.dex);added.add(option.incoming.dex);
  if(chosen.length>=3)break;
 }
 return chosen;
}

export {PLAYSTYLES,ALL_TYPES,statsOf,pokemonTypes,matchup,allOffensiveTargets,roleOf,ratingOf,recommend,teamSnapshot,replacementIdeas,getEligible};
