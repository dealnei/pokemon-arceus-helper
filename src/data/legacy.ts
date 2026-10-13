// @ts-nocheck
// Preserved Pokédex and investment metadata from the original site.
// Keep game-specific corrections here; UI components should never mutate these constants.
const DEX_NAMES = `Rowlet|Dartrix|Decidueye|Cyndaquil|Quilava|Typhlosion|Oshawott|Dewott|Samurott|Bidoof|Bibarel|Starly|Staravia|Staraptor|Shinx|Luxio|Luxray|Wurmple|Silcoon|Beautifly|Cascoon|Dustox|Ponyta|Rapidash|Eevee|Vaporeon|Jolteon|Flareon|Espeon|Umbreon|Leafeon|Glaceon|Sylveon|Zubat|Golbat|Crobat|Drifloon|Drifblim|Kricketot|Kricketune|Buizel|Floatzel|Burmy|Wormadam|Mothim|Geodude|Graveler|Golem|Stantler|Wyrdeer|Munchlax|Snorlax|Paras|Parasect|Pichu|Pikachu|Raichu|Abra|Kadabra|Alakazam|Chimchar|Monferno|Infernape|Buneary|Lopunny|Cherubi|Cherrim|Psyduck|Golduck|Combee|Vespiquen|Scyther|Kleavor|Scizor|Heracross|Mime Jr.|Mr. Mime|Aipom|Ambipom|Magikarp|Gyarados|Shellos|Gastrodon|Qwilfish|Overqwil|Happiny|Chansey|Blissey|Budew|Roselia|Roserade|Carnivine|Petilil|Lilligant|Tangela|Tangrowth|Barboach|Whiscash|Croagunk|Toxicroak|Ralts|Kirlia|Gardevoir|Gallade|Yanma|Yanmega|Hippopotas|Hippowdon|Pachirisu|Stunky|Skuntank|Teddiursa|Ursaring|Ursaluna|Goomy|Sliggoo|Goodra|Onix|Steelix|Rhyhorn|Rhydon|Rhyperior|Bonsly|Sudowoodo|Lickitung|Lickilicky|Togepi|Togetic|Togekiss|Turtwig|Grotle|Torterra|Porygon|Porygon2|Porygon-Z|Gastly|Haunter|Gengar|Spiritomb|Murkrow|Honchkrow|Unown|Spheal|Sealeo|Walrein|Remoraid|Octillery|Skorupi|Drapion|Growlithe|Arcanine|Glameow|Purugly|Machop|Machoke|Machamp|Chatot|Duskull|Dusclops|Dusknoir|Piplup|Prinplup|Empoleon|Mantyke|Mantine|Basculin|Basculegion|Vulpix|Ninetales|Tentacool|Tentacruel|Finneon|Lumineon|Magby|Magmar|Magmortar|Magnemite|Magneton|Magnezone|Bronzor|Bronzong|Elekid|Electabuzz|Electivire|Gligar|Gliscor|Gible|Gabite|Garchomp|Nosepass|Probopass|Voltorb|Electrode|Rotom|Chingling|Chimecho|Misdreavus|Mismagius|Cleffa|Clefairy|Clefable|Sneasel|Sneasler|Weavile|Snorunt|Glalie|Froslass|Cranidos|Rampardos|Shieldon|Bastiodon|Swinub|Piloswine|Mamoswine|Bergmite|Avalugg|Snover|Abomasnow|Zorua|Zoroark|Rufflet|Braviary|Riolu|Lucario|Uxie|Mesprit|Azelf|Heatran|Regigigas|Cresselia|Tornadus|Thundurus|Landorus|Enamorus|Dialga|Palkia|Giratina|Arceus|Phione|Manaphy|Shaymin|Darkrai`.split('|');
const NATURES={Adamant:['Decisa','Attack','Sp. Attack'],Jolly:['Allegra','Speed','Sp. Attack'],Modest:['Modesta','Sp. Attack','Attack'],Timid:['Timida','Speed','Attack'],Impish:['Scaltra','Defense','Sp. Attack'],Bold:['Sicura','Defense','Attack'],Careful:['Cauta','Sp. Defense','Sp. Attack'],Calm:['Calma','Sp. Defense','Attack'],Naughty:['Birbona','Attack','Sp. Defense'],Lonely:['Schiva','Attack','Defense'],Mild:['Mite','Sp. Attack','Defense'],Rash:['Ardente','Sp. Attack','Sp. Defense'],Brave:['Audace','Attack','Speed'],Quiet:['Quieta','Sp. Attack','Speed'],Hasty:['Lesta','Speed','Defense'],Naive:['Ingenua','Speed','Sp. Defense'],Relaxed:['Placida','Defense','Speed'],Sassy:['Vivace','Sp. Defense','Speed']};
const TYPE_COLORS={Normal:'#c8c3b5',Fire:'#fa9e73',Water:'#7bb5ed',Electric:'#eed071',Grass:'#88d09f',Ice:'#8edbd9',Fighting:'#ed8d8d',Poison:'#c68edb',Ground:'#d7b77c',Flying:'#a8aff2',Psychic:'#f4a0c4',Bug:'#b9d483',Rock:'#b8aa85',Ghost:'#a9a4e2',Dragon:'#889fe8',Dark:'#adb2c0',Steel:'#a3bbc6',Fairy:'#e1a9df'};
const OVERRIDES={
'Rowlet':'Adamant,Jolly,Modest','Dartrix':'Adamant,Jolly,Modest','Decidueye':'Adamant,Jolly,Careful','Cyndaquil':'Modest,Timid,Calm','Quilava':'Modest,Timid,Calm','Typhlosion':'Modest,Timid,Calm','Oshawott':'Adamant,Jolly,Modest','Dewott':'Adamant,Jolly,Modest','Samurott':'Adamant,Jolly,Modest',
'Wurmple':'Timid,Modest,Calm','Silcoon':'Modest,Timid,Bold','Beautifly':'Modest,Timid,Bold','Cascoon':'Calm,Bold,Modest','Dustox':'Calm,Bold,Modest','Burmy':'Modest,Bold,Calm','Wormadam':'Bold,Calm,Modest','Mothim':'Modest,Timid,Calm','Eevee':'Modest,Timid,Adamant','Vaporeon':'Modest,Calm,Bold','Jolteon':'Timid,Modest,Calm','Flareon':'Adamant,Jolly,Brave','Espeon':'Modest,Timid,Calm','Umbreon':'Calm,Bold,Careful','Leafeon':'Adamant,Jolly,Impish','Glaceon':'Modest,Timid,Bold','Sylveon':'Modest,Calm,Bold',
'Starly':'Adamant,Jolly,Naughty','Staravia':'Adamant,Jolly,Naughty','Staraptor':'Adamant,Jolly,Naughty','Shinx':'Adamant,Jolly,Naughty','Luxio':'Adamant,Jolly,Naughty','Luxray':'Adamant,Jolly,Naughty','Ponyta':'Adamant,Jolly,Naughty','Rapidash':'Adamant,Jolly,Naughty','Zubat':'Adamant,Jolly,Impish','Golbat':'Adamant,Jolly,Impish','Crobat':'Adamant,Jolly,Impish',
'Drifloon':'Modest,Timid,Bold','Drifblim':'Modest,Timid,Bold','Bidoof':'Adamant,Jolly,Naughty','Bibarel':'Adamant,Jolly,Naughty','Buizel':'Adamant,Jolly,Naughty','Floatzel':'Adamant,Jolly,Naughty','Kricketot':'Adamant,Jolly,Naughty','Kricketune':'Adamant,Jolly,Naughty','Pichu':'Timid,Modest,Jolly','Pikachu':'Timid,Modest,Jolly','Raichu':'Timid,Modest,Jolly',
'Abra':'Modest,Timid,Mild','Kadabra':'Modest,Timid,Mild','Alakazam':'Modest,Timid,Mild','Psyduck':'Modest,Timid,Mild','Golduck':'Modest,Timid,Mild','Mime Jr.':'Modest,Timid,Calm','Mr. Mime':'Modest,Timid,Calm','Scyther':'Adamant,Jolly,Impish','Scizor':'Adamant,Impish,Careful','Kleavor':'Adamant,Jolly,Impish','Shellos':'Modest,Bold,Calm','Gastrodon':'Modest,Bold,Calm','Geodude':'Adamant,Impish,Careful','Graveler':'Adamant,Impish,Careful','Golem':'Adamant,Impish,Careful','Onix':'Adamant,Impish,Careful','Steelix':'Adamant,Careful,Impish',
'Paras':'Adamant,Careful,Impish','Parasect':'Adamant,Careful,Impish','Machop':'Adamant,Jolly,Careful','Machoke':'Adamant,Jolly,Careful','Machamp':'Adamant,Jolly,Careful','Haunter':'Modest,Timid,Mild','Gastly':'Modest,Timid,Mild','Gengar':'Modest,Timid,Mild','Stantler':'Adamant,Modest,Jolly','Wyrdeer':'Adamant,Modest,Jolly','Buneary':'Adamant,Jolly,Naughty','Lopunny':'Adamant,Jolly,Naughty','Combee':'Modest,Calm,Bold','Vespiquen':'Modest,Calm,Bold','Sneasel':'Adamant,Jolly,Naughty','Weavile':'Adamant,Jolly,Naughty','Sneasler':'Adamant,Jolly,Naughty'
};
const SPECIAL_RARE=new Set('Eevee Munchlax Cherubi Cherrim Pichu Happiny Bonsly Cleffa Togepi Porygon Porygon2 Porygon-Z Spiritomb Unown Cranidos Rampardos Shieldon Bastiodon Rotom Magnemite Magneton Magnezone Riolu Lucario'.split(' '));
const EXTRA_METHODS={
25:'Vaporeon: Water Stone · Jolteon: Thunder Stone · Flareon: Fire Stone · Espeon: high friendship by day (no Fairy move) · Umbreon: high friendship at night (no Fairy move) · Leafeon: Leaf Stone or Mossy Rock · Glaceon: Ice Stone or Ice Rock · Sylveon: high friendship while knowing a Fairy-type move.',
18:'At level 7, evolves into Silcoon or Cascoon according to a hidden individual value. Time of day and Nature do NOT control this. Both evolve again at level 10.',
43:'At level 20: female Burmy evolves into Wormadam (cloak determines form); male Burmy evolves into Mothim. Burmy can change cloak depending on where it battles before evolving.',
72:'Use a Black Augurite for Kleavor, or a Metal Coat for Scizor. Neither requires trading in Legends: Arceus.',
84:'Hisuian Qwilfish → Overqwil: use Barb Barrage in Strong Style 20 times.',
49:'Stantler → Wyrdeer: use Psyshield Bash in Agile Style 20 times.',
112:'Teddiursa → Ursaring at level 30. Ursaring → Ursaluna: use a Peat Block during a full moon.',
114:'Use a Peat Block on Ursaring during a full moon.',
115:'Goomy → Hisuian Sliggoo at level 40. Hisuian Sliggoo → Hisuian Goodra at level 50 while raining.',
118:'Onix → Steelix: use a Metal Coat (no trade required).',
133:'Porygon → Porygon2: use an Upgrade. Porygon2 → Porygon-Z: use a Dubious Disc.',
166:'White-striped Basculin → Basculegion: accumulate at least 294 recoil damage without fainting, then evolve.',
192:'Hisuian Voltorb → Hisuian Electrode: use a Leaf Stone.',
202:'Hisuian Sneasel → Sneasler with Razor Claw during the day. Original Sneasel → Weavile with Razor Claw at night.',
203:'Hisuian Sneasel → Sneasler with Razor Claw during the day.',
204:'Original Sneasel → Weavile with Razor Claw at night; original Sneasel appears in Obsidian Fieldlands space-time distortions.',
127:'Togepi → Togetic: high friendship. Togetic → Togekiss: use a Shiny Stone.',
76:'Mime Jr. → Mr. Mime: know the move Mimic, then select Evolve.',
78:'Aipom → Ambipom: know Double Hit, then select Evolve.',
103:'Female Kirlia → Gardevoir at level 30, or male Kirlia → Gallade with a Dawn Stone.',
138:'Gastly → Haunter at level 25. Haunter → Gengar using Linking Cord or trading.',
46:'Geodude → Graveler at level 25. Graveler → Golem using Linking Cord or trading.',
154:'Machop → Machoke at level 28. Machoke → Machamp using Linking Cord or trading.',
137:'Haunter → Gengar using Linking Cord or trading.',
193:'Hisuian Voltorb evolves using a Leaf Stone.',
174:'Magby → Magmar at level 30. Magmar → Magmortar using a Magmarizer.',
182:'Elekid → Electabuzz at level 30. Electabuzz → Electivire using an Electirizer.',
178:'Magnemite → Magneton at level 30. Magneton → Magnezone using a Thunder Stone or magnetic field in Coronet Highlands.',
186:'Gligar → Gliscor: use Razor Fang at night.',
189:'Gible → Gabite at level 24. Gabite → Garchomp at level 48.',
213:'Piloswine → Mamoswine: learn Ancient Power.',
242:'No evolution. Requires Brilliant Diamond/Shining Pearl save data to unlock Request 93 after the credits.',
241:'No evolution. Requires Sword/Shield save data to unlock Request 92 after the credits.'
};
const ACQUIRE={
2:'Evolve Rowlet from level 17, or encounter Dartrix in Coronet Highlands space-time distortions.',
3:'Evolve Dartrix from level 36, or encounter Hisuian Decidueye in Coronet Highlands space-time distortions.',
5:'Evolve Cyndaquil from level 17, or encounter Quilava in Crimson Mirelands space-time distortions.',
6:'Evolve Quilava from level 36, or encounter Hisuian Typhlosion in Crimson Mirelands space-time distortions.',
8:'Evolve Oshawott from level 17, or encounter Dewott in Alabaster Icelands space-time distortions.',
9:'Evolve Dewott from level 36, or encounter Hisuian Samurott in Alabaster Icelands space-time distortions.',
1:'Choose Rowlet as your starter; otherwise receive from Professor Laventon after the main story, or find its line in Coronet Highlands distortions.',
4:'Choose Cyndaquil as your starter; otherwise receive from Professor Laventon after the main story, or find its line in Crimson Mirelands distortions.',
7:'Choose Oshawott as your starter; otherwise receive from Professor Laventon after the main story, or find its line in Alabaster Icelands distortions.',
26:'Evolve Eevee with a Water Stone, or find Vaporeon in Cobalt Coastlands space-time distortions.',
27:'Evolve Eevee with a Thunder Stone, or find Jolteon in Coronet Highlands space-time distortions.',
28:'Evolve Eevee with a Fire Stone, or find Flareon in Crimson Mirelands/Cobalt Coastlands distortions.',
29:'Evolve Eevee with high friendship in daytime without a Fairy move, or find Espeon in Alabaster Icelands distortions.',
30:'Evolve Eevee with high friendship at night without a Fairy move, or find Umbreon in Crimson Mirelands distortions.',
31:'Evolve Eevee with Leaf Stone/Mossy Rock, or find Leafeon in Obsidian Fieldlands distortions.',
32:'Evolve Eevee with Ice Stone/Ice Rock, or find Glaceon in Alabaster Icelands distortions.',
33:'Evolve Eevee with high friendship and a Fairy move, or find Sylveon in Obsidian Fieldlands/Coronet Highlands distortions.',
74:'Evolve Scyther with a Metal Coat, or find Scizor in Alabaster Icelands distortions.',
133:'Find Porygon in Crimson Mirelands space-time distortions.',
134:'Use Upgrade on Porygon, or find Porygon2 in Crimson Mirelands distortions.',
135:'Use Dubious Disc on Porygon2, or find Porygon-Z in Crimson Mirelands distortions.',
177:'Find Magnemite in Cobalt Coastlands space-time distortions.',
178:'Evolve Magnemite, or find Magneton in Cobalt Coastlands space-time distortions.',
139:'Complete Request 22 by collecting 107 wisps, then encounter Spiritomb at the Shrouded Ruins. Additional encounters may become possible.',
142:'Find the 28 hidden Unown across Hisui using the clues in your Unown Research Notes.',
202:'Hisuian Sneasel: Coronet Highlands. Original Dark/Ice Sneasel: Obsidian Fieldlands space-time distortions.',
204:'Evolve original Sneasel using Razor Claw at night; also check Obsidian Fieldlands distortions.',
208:'Find Cranidos in Coronet Highlands space-time distortions.',
209:'Evolve Cranidos at level 30, or find Rampardos in Coronet Highlands space-time distortions.',
208:'Cranidos and Rampardos are found in Coronet Highlands space-time distortions, or evolve Cranidos.',
210:'Find Shieldon in Coronet Highlands space-time distortions.',
211:'Evolve Shieldon at level 30, or find Bastiodon in Coronet Highlands space-time distortions.',
210:'Shieldon and Bastiodon are found in Coronet Highlands space-time distortions, or evolve Shieldon.',
225:'Postgame story: visit Lake Acuity and complete the associated lake quest.',
226:'Postgame story: visit Lake Verity and complete the associated lake quest.',
227:'Postgame story: visit Lake Valor and complete the associated lake quest.',
228:'Postgame plate quest at Firespit Island.',229:'Postgame plate quest inside Snowpoint Temple.',230:'Postgame plate quest at Moonview Arena.',
231:'Request 94: appear in Alabaster Icelands (Bonechill Wastes), during a blizzard.',
232:'Request 94: appear over water at Cobalt Coastlands, during a thunderstorm.',
233:'Request 94: appear at Ramanas Island, Obsidian Fieldlands, in clear weather.',
234:'Request 94: encounter Enamorus in Scarlet Bog after collecting the other Forces of Nature.',
235:'Main story at Temple of Sinnoh.',236:'Main story at Temple of Sinnoh.',
237:'After defeating Volo in the postgame, find Giratina at Turnback Cave.',
238:'Complete the required Hisui Pokédex and return to the Temple of Sinnoh. Mythical bonuses are not required.',
239:'Request 66, The Sea’s Legend: reach Seaside Hollow with Buizel, Mantyke and Overqwil in your party, passing the sea gate at evening.',
240:'Request 66, The Sea’s Legend: reach Seaside Hollow with Buizel, Mantyke and Overqwil in your party, passing the sea gate at evening.',
241:'Request 92 after the main story, with Pokémon Sword or Shield save data on your Switch. Find Shaymin at Floaro Gardens.',
242:'Request 93 after the main story, with Pokémon Brilliant Diamond or Shining Pearl save data on your Switch. Find Darkrai at Clamberclaw Cliffs.'
};

let pokes=[];
export function setInvestCatalog(value){pokes=value}
/* Long-term in-game investment grades; not PvP rankings or a raw base-stat list.
   All 242 regional Pokédex entries are mapped through the evolution lines below. */
const INVEST_LINES=[
'Rowlet>Dartrix>Decidueye',
'Cyndaquil>Quilava>Typhlosion',
'Oshawott>Dewott>Samurott',
'Bidoof>Bibarel',
'Starly>Staravia>Staraptor',
'Shinx>Luxio>Luxray',
'Wurmple>Silcoon>Beautifly',
'Wurmple>Cascoon>Dustox',
'Ponyta>Rapidash',
'Eevee>Vaporeon',
'Eevee>Jolteon',
'Eevee>Flareon',
'Eevee>Espeon',
'Eevee>Umbreon',
'Eevee>Leafeon',
'Eevee>Glaceon',
'Eevee>Sylveon',
'Zubat>Golbat>Crobat',
'Drifloon>Drifblim',
'Kricketot>Kricketune',
'Buizel>Floatzel',
'Burmy>Wormadam',
'Burmy>Mothim',
'Geodude>Graveler>Golem',
'Stantler>Wyrdeer',
'Munchlax>Snorlax',
'Paras>Parasect',
'Pichu>Pikachu>Raichu',
'Abra>Kadabra>Alakazam',
'Chimchar>Monferno>Infernape',
'Buneary>Lopunny',
'Cherubi>Cherrim',
'Psyduck>Golduck',
'Combee>Vespiquen',
'Scyther>Kleavor',
'Scyther>Scizor',
'Heracross',
'Mime Jr.>Mr. Mime',
'Aipom>Ambipom',
'Magikarp>Gyarados',
'Shellos>Gastrodon',
'Qwilfish>Overqwil',
'Happiny>Chansey>Blissey',
'Budew>Roselia>Roserade',
'Carnivine',
'Petilil>Lilligant',
'Tangela>Tangrowth',
'Barboach>Whiscash',
'Croagunk>Toxicroak',
'Ralts>Kirlia>Gardevoir',
'Ralts>Kirlia>Gallade',
'Yanma>Yanmega',
'Hippopotas>Hippowdon',
'Pachirisu',
'Stunky>Skuntank',
'Teddiursa>Ursaring>Ursaluna',
'Goomy>Sliggoo>Goodra',
'Onix>Steelix',
'Rhyhorn>Rhydon>Rhyperior',
'Bonsly>Sudowoodo',
'Lickitung>Lickilicky',
'Togepi>Togetic>Togekiss',
'Turtwig>Grotle>Torterra',
'Porygon>Porygon2>Porygon-Z',
'Gastly>Haunter>Gengar',
'Spiritomb',
'Murkrow>Honchkrow',
'Unown',
'Spheal>Sealeo>Walrein',
'Remoraid>Octillery',
'Skorupi>Drapion',
'Growlithe>Arcanine',
'Glameow>Purugly',
'Machop>Machoke>Machamp',
'Chatot',
'Duskull>Dusclops>Dusknoir',
'Piplup>Prinplup>Empoleon',
'Mantyke>Mantine',
'Basculin>Basculegion',
'Vulpix>Ninetales',
'Tentacool>Tentacruel',
'Finneon>Lumineon',
'Magby>Magmar>Magmortar',
'Magnemite>Magneton>Magnezone',
'Bronzor>Bronzong',
'Elekid>Electabuzz>Electivire',
'Gligar>Gliscor',
'Gible>Gabite>Garchomp',
'Nosepass>Probopass',
'Voltorb>Electrode',
'Rotom',
'Chingling>Chimecho',
'Misdreavus>Mismagius',
'Cleffa>Clefairy>Clefable',
'Sneasel>Sneasler',
'Sneasel>Weavile',
'Snorunt>Glalie',
'Snorunt>Froslass',
'Cranidos>Rampardos',
'Shieldon>Bastiodon',
'Swinub>Piloswine>Mamoswine',
'Bergmite>Avalugg',
'Snover>Abomasnow',
'Zorua>Zoroark',
'Rufflet>Braviary',
'Riolu>Lucario',
'Uxie',
'Mesprit',
'Azelf',
'Heatran',
'Regigigas',
'Cresselia',
'Tornadus',
'Thundurus',
'Landorus',
'Enamorus',
'Dialga',
'Palkia',
'Giratina',
'Arceus',
'Phione',
'Manaphy',
'Shaymin',
'Darkrai'
].map(line=>line.split('>'));
const INVEST_FINAL_GRADES={
  S:'Garchomp|Gyarados|Togekiss|Goodra|Ursaluna|Dialga|Palkia|Giratina|Arceus|Cresselia',
  A:'Decidueye|Typhlosion|Samurott|Staraptor|Luxray|Vaporeon|Jolteon|Espeon|Umbreon|Leafeon|Glaceon|Sylveon|Crobat|Alakazam|Infernape|Snorlax|Scizor|Kleavor|Heracross|Gastrodon|Overqwil|Blissey|Roserade|Lilligant|Tangrowth|Gardevoir|Gallade|Yanmega|Hippowdon|Drapion|Arcanine|Machamp|Empoleon|Torterra|Basculegion|Ninetales|Tentacruel|Magmortar|Magnezone|Bronzong|Electivire|Gliscor|Mamoswine|Zoroark|Braviary|Lucario|Gengar|Weavile|Sneasler|Rhyperior|Porygon-Z|Froslass|Heatran|Darkrai',
  B:'Flareon|Rapidash|Drifblim|Floatzel|Golem|Wyrdeer|Parasect|Raichu|Golduck|Vespiquen|Mr. Mime|Whiscash|Toxicroak|Skuntank|Steelix|Lickilicky|Spiritomb|Honchkrow|Walrein|Octillery|Dusknoir|Mantine|Electrode|Rotom|Mismagius|Clefable|Glalie|Rampardos|Avalugg|Abomasnow|Uxie|Mesprit|Azelf|Tornadus|Thundurus|Landorus|Enamorus|Regigigas|Manaphy|Shaymin',
  C:'Bibarel|Wormadam|Lopunny|Cherrim|Ambipom|Sudowoodo|Purugly|Probopass|Bastiodon|Pachirisu|Chimecho|Porygon2|Glameow|Phione',
  D:'Beautifly|Dustox|Kricketune|Mothim|Carnivine|Chatot|Lumineon',
  F:'Unown'
};
const INVEST_GRADES=Object.fromEntries(Object.entries(INVEST_FINAL_GRADES).flatMap(([grade,names])=>names.split('|').map(n=>[n,grade])));
const INVEST_SCALE={S:5,A:4,B:3,C:2,D:1,F:0};
const INVEST_LABELS={
 S:'Excellent long-term main-team pick',A:'Strong long-term investment',
 B:'Good, especially with the right role',C:'Viable, but often replaceable',
 D:'Usually a temporary choice',F:'Very low main-team priority'
};
const INVEST_TARGET_PREFERENCE={Eevee:'Sylveon',Wurmple:'Beautifly',Burmy:'Wormadam',Scyther:'Scizor',Ralts:'Gardevoir',Kirlia:'Gardevoir',Snorunt:'Froslass',Sneasel:'Sneasler'};
const INVEST_NOTES={
 Garchomp:'Exceptional Attack and Speed; one of the strongest late-story offensive choices.',
 Dialga:'Exceptional legendary with strong Steel/Dragon typing, but acquired near the end of the main story.',
 Palkia:'Exceptional legendary with Water/Dragon typing, but acquired near the end of the main story.',
 Arceus:'Exceptional battle potential, but obtained only after extensive late-game Pokédex completion.',
 Gyarados:'Excellent Attack and strong overall stats. Magikarp is weak now, but the evolution payoff is substantial.',
 Togekiss:'Bulky Fairy/Flying coverage with strong special damage and a valuable Dragon immunity.',
 Goodra:'Excellent defensive typing and bulk; Hisuian Goodra is a durable endgame teammate.',
 Ursaluna:'Outstanding physical power and bulk, but relatively slow; requires a special evolution item.',
 Staraptor:'Accessible early, hits hard and remains useful through the main story.',
 Luxray:'Reliable early Electric-type physical attacker; speed is its main limitation.',
 Gastrodon:'Excellent Water/Ground coverage and bulk; beware its severe Grass weakness.',
 Gengar:'Excellent Special Attack and Speed; relatively fragile and weak to several common attack types.',
 Lucario:'Fast mixed-offense Steel/Fighting option, but availability and evolution effort matter.',
 Scizor:'Great defensive Steel typing and physical damage; be cautious about Fire.',
 Kleavor:'Powerful physical Bug/Rock attacker with good offensive options.',
 Sylveon:'Durable special Fairy attacker with great Dragon/Dark/Fighting matchups.',
 Sneasler:'Fast physical Poison/Fighting attacker with strong offensive pressure.',
 Weavile:'Very fast Ice/Dark physical attacker; vulnerable to Fighting.',
 Magnezone:'Excellent Special Attack with many resistances, balanced by Ground/Fighting/Fire threats.',
 Parasect:'Excellent capture utility with Spore and False Swipe, but numerous battle weaknesses.',
 Unown:'Extremely limited battle flexibility; prioritize it for Pokédex completion instead.'
};
function investGrade(p){
 const name=p.name;
 const choices=INVEST_LINES.filter(line=>line.includes(name)).map(line=>line[line.length-1]);
 const preference=INVEST_TARGET_PREFERENCE[name];
 const scored=choices.filter(x=>Object.prototype.hasOwnProperty.call(INVEST_GRADES,x))
   .sort((a,b)=>(INVEST_SCALE[INVEST_GRADES[b]]-INVEST_SCALE[INVEST_GRADES[a]])||a.localeCompare(b));
 const target=preference&&choices.includes(preference)?preference:scored[0]||name;
 const grade=INVEST_GRADES[target]||INVEST_GRADES[name]||'C';
 const evolvable=target!==name;
 const postgame=new Set('Uxie Mesprit Azelf Heatran Regigigas Cresselia Tornadus Thundurus Landorus Enamorus Giratina Arceus Phione Manaphy Shaymin Darkrai'.split(' ')).has(name);
 const lateStory=name==='Dialga'||name==='Palkia';
 const action=postgame?'Postgame / special-access Pokémon':lateStory?'Very late story pick; excellent for the finale':evolvable?(INVEST_SCALE[grade]>=3?'Invest & evolve into '+target:grade==='C'?'Evolve if you like it, but compare alternatives':'Evolve for Pokédex; avoid heavy main-team investment'):
   grade==='S'||grade==='A'?'Keep for your main team':grade==='B'?'Keep if it fits your strategy':
   grade==='C'?'Useful, but compare alternatives':'Low main-team investment priority';
 const targetP=pokes.find(x=>x.name===target);
 const stageNote=evolvable?('Grade reflects the evolved form, not the current stage.'+(name==='Combee'?' Only female Combee evolve.':name==='Wurmple'?' Evolution into Silcoon or Cascoon depends on a hidden value.':name==='Sneasel'?' Hisuian Sneasel evolves into Sneasler; original Sneasel evolves into Weavile.':'')):null;
 const note=INVEST_NOTES[target]||INVEST_NOTES[name]||
  (targetP&&targetP.stats.length===6?(()=>{const [hp,atk,def,spa,spd,spe]=targetP.stats;const power=Math.max(atk,spa);
   if(power>=120&&spe>=95)return 'High attacking power and Speed make it valuable in the action-order system.';
   if(power>=110)return 'Strong offensive potential; team type coverage and survivability matter.';
   if(hp+def+spd>=300)return 'Defensive staying power can be valuable against difficult encounters.';
   if(spe>=105)return 'Good Speed helps you act sooner; consider its type matchups.';
   return 'A useful role is possible, but stronger options may fit the main story better.';})():
  'Practical recommendation for the game storyline; actual usefulness depends on moves, availability and your team.');
 return {grade,target,evolvable,postgame,lateStory,action,note,stageNote,summary:INVEST_LABELS[grade]};
}

function natures(p){if(OVERRIDES[p.name])return OVERRIDES[p.name].split(',');const s=p.stats||[];if(s.length!==6)return ['Adamant','Jolly','Modest'];const [hp,atk,def,spa,spd,spd2]=s;if(atk>spa*1.13)return atk<def*.68 && def>120?['Impish','Careful','Adamant']:['Adamant','Jolly','Careful'];if(spa>atk*1.13)return ['Modest','Timid','Calm'];if(def>=100&&def>atk*1.18)return ['Impish','Careful','Adamant'];if(spd>=100&&spd>spa*1.18)return ['Calm','Bold','Modest'];return atk>=spa?['Adamant','Jolly','Modest']:['Modest','Timid','Adamant'];}
function isEvolutionOnly(p){return /^(evolve |evolution only|evolve$)/i.test(p.locations||'')}
function rarity(p){if(p.dex>=225)return 'Unique';if([1,2,3,4,5,6,7,8,9].includes(p.dex))return 'Rare';if(SPECIAL_RARE.has(p.name)||[25,166,202,204].includes(p.dex))return 'Rare';const loc=p.locations||'';if(/Space.Time Distortion/i.test(loc) && !loc.includes(','))return 'Very rare';if(/Evolve/i.test(loc)&&!loc.includes(','))return 'Uncommon';const c=loc.split(',').length;if(c>=5)return 'Common';if(c>=3)return 'Uncommon';if(c===2)return 'Uncommon';return 'Rare'}
function obtain(p){return ACQUIRE[p.dex]||p.locations||'Check evolution chain and field encounters.'}
function evolution(p){if(EXTRA_METHODS[p.dex])return EXTRA_METHODS[p.dex];return (p.evolution||'No evolution').replace(/Trade holding /gi,'Use ').replace(/Trade with /gi,'Use ').replace(/Trade\b(?!-)/gi,'Linking Cord or trade').replace(/Lvl /gi,'Level ').replace(/\s*–\s*/g,' · ').replace(/\s*\|\s*/g,'\nAlternative: ').replace('Upgrade)','Upgrade');}
function sprite(p){return p.id?`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`:''}

async function fetchText(urls){
  const key='hisui-v3-data-'+urls[0].split('/').pop();
  for(const u of urls){
    const ctrl=new AbortController(),tm=setTimeout(()=>ctrl.abort(),8500);
    try{
      const r=await fetch(u,{signal:ctrl.signal,cache:'default'});
      if(!r.ok)throw new Error('HTTP '+r.status);
      const t=await r.text();
      if(t.length<1000)throw new Error('Unexpected short response');
      try{localStorage.setItem(key,t)}catch{}
      return t;
    }catch(e){/* Try another mirror, then the cached source. */}
    finally{clearTimeout(tm)}
  }
  try{const cached=localStorage.getItem(key);if(cached&&cached.length>1000)return cached}catch{}
  throw new Error('Unable to load remote or cached sources');
}
function parseCSV(t){return t.replace(/\r/g,'').trim().split('\n').slice(1).map(line=>{let fields=[],v='',quoted=false;for(let i=0;i<line.length;i++){const c=line[i];if(c==='"'){if(quoted&&line[i+1]==='"'){v+='"';i++}else quoted=!quoted;}else if(c===','&&!quoted){fields.push(v.trim());v=''}else v+=c}fields.push(v.trim());return fields})}
function getStats(rows,p){const candidates=rows.filter(r=>+r[0]===+p.id),types=p.type.split(' / ');let r=candidates.find(z=>z[3]===types[0]&&(z[4]||'')===(types[1]||''))||candidates[0];return r?r.slice(6,12).map(Number):[]}

// ─── Team Lab: explainable, offline-once-cached recommendations ───

export {DEX_NAMES,NATURES,TYPE_COLORS,INVEST_LINES,INVEST_SCALE,INVEST_LABELS,EXTRA_METHODS,ACQUIRE,investGrade,natures,isEvolutionOnly,rarity,obtain,evolution,sprite,sortRarity,fetchText,parseCSV,getStats};
export function evolutionFamily(p,all){
 const chains=INVEST_LINES.filter(line=>line.includes(p.name));
 const names=[...new Set(chains.flat())];
 return names.map(n=>all.find(item=>item.name===n)).filter(Boolean).sort((a,b)=>a.dex-b.dex);
}
export const DATA_SOURCES={
 pokemon:['https://raw.githubusercontent.com/Insektaure/pkDex/main/resources/data/sinnoh_arceus.json','https://cdn.jsdelivr.net/gh/Insektaure/pkDex@main/resources/data/sinnoh_arceus.json'],
 stats:['https://raw.githubusercontent.com/lgreski/pokemonData/master/Pokemon.csv','https://cdn.jsdelivr.net/gh/lgreski/pokemonData@master/Pokemon.csv']
};
