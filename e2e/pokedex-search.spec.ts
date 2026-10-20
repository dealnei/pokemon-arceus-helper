import {test,expect} from '@playwright/test';
import {DEX_NAMES} from '../src/data/legacy';

test.beforeEach(async({page})=>{
 // Keep search/filter checks independent of remote dataset availability.
 const pokemon=DEX_NAMES.map((name:string,index:number)=>({
  id:index+1,name,type:index<3?'Grass / Flying':'Normal',
  locations:'Obsidian Fieldlands',evolution:'-'
 }));
 await page.route('**/sinnoh_arceus.json',route=>route.fulfill({json:{pokemon}}));
 const stats='ID,Name,Form,Type1,Type2,Total,HP,Attack,Defense,SpAtk,SpDef,Speed\n'+
  pokemon.map(p=>`${p.id},${p.name},,${p.type.split(' / ')[0]},${p.type.split(' / ')[1]||''},300,50,50,50,50,50,50`).join('\n');
 await page.route('**/Pokemon.csv',route=>route.fulfill({body:stats,contentType:'text/csv'}));
 await page.goto('/');
 await expect(page.locator('.results')).not.toContainText('loading details');
});

for(const width of [1280,390]){
 test(`Pokédex has one Pokémon search at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:844});
  const search=page.getByRole('textbox',{name:'Search all Pokédex columns'});
  await expect(search).toHaveCount(1);
  await expect(search).toBeVisible();
  await expect(page.getByRole('searchbox',{name:'Filter by Pokémon',exact:true})).toHaveCount(0);
  await expect(page.locator('.column-filters input,.column-filters select')).toHaveCount(7);
  await search.fill('  rOwLeT  ');
  // Global search also finds Dartrix through its "Evolve Rowlet" acquisition text.
  await expect(page.locator('.table-pokemon b')).toHaveText(['Rowlet','Dartrix']);
  await search.clear();
  await expect(page.locator('.pokedex-table tbody tr')).toHaveCount(242);
 });
}

test('Global search combines with column filters and keeps sorting and reset',async({page})=>{
 const rows=page.locator('.pokedex-table tbody tr');
 const search=page.getByRole('textbox',{name:'Search all Pokédex columns'});
 await search.fill('rowlet');
 await page.getByLabel('Filter by Type',{exact:true}).selectOption('Normal');
 await expect(rows).toHaveCount(0);
 await expect(page.getByText('No matches. Try clearing one or more filters.')).toBeVisible();
 await page.getByLabel('Filter by Type',{exact:true}).selectOption('Grass');
 await expect(rows.locator('.table-pokemon b')).toHaveText(['Rowlet','Dartrix']);
 await search.clear();
 await expect(rows).toHaveCount(3);
 await page.getByLabel('Filter by #',{exact:true}).fill('1–2');
 await expect(rows).toHaveCount(2);
 await page.getByLabel('Filter by Where to obtain',{exact:true}).fill('not-a-place');
 await expect(rows).toHaveCount(0);
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 await expect(rows).toHaveCount(242);
 await expect(search).toHaveValue('');
 for(const name of ['Type','Grade','Availability','Best Natures','★']){
  await expect(page.getByLabel('Filter by '+name,{exact:true})).toHaveValue('');
 }
 // Every remaining select filter still narrows the table.
 for(const [name,value] of [['Grade','F'],['Availability','Unique'],['Best Natures','Adamant']]){
  const filter=page.getByLabel('Filter by '+name,{exact:true});
  await filter.selectOption(value);
  await expect.poll(()=>rows.count()).toBeGreaterThan(0);
  expect(await rows.count()).toBeLessThan(242);
  await filter.selectOption('');
 }
 await page.getByRole('button',{name:'Favorite Rowlet',exact:true}).click();
 await page.getByLabel('Filter by ★',{exact:true}).selectOption('yes');
 await expect(rows).toHaveCount(1);
 await expect(rows.first()).toContainText('Rowlet');
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 const nameHeader=page.locator('.pokedex-table thead tr').first().locator('th').nth(1);
 await nameHeader.getByRole('button').click();
 await expect(nameHeader).toHaveAttribute('aria-sort','ascending');
 const names=await rows.locator('.table-pokemon b').allTextContents();
 const sorted=[...names].sort((a,b)=>a.localeCompare(b,undefined,{numeric:true,sensitivity:'base'}));
 expect(names).toEqual(sorted);
 await nameHeader.getByRole('button').click();
 await expect(nameHeader).toHaveAttribute('aria-sort','descending');
 await expect(rows.locator('.table-pokemon b')).toHaveText([...sorted].reverse());
 await page.getByRole('button',{name:'Reset',exact:true}).click();
 await expect(rows.first()).toContainText('Rowlet');
 await expect(page.locator('.pokedex-table thead th').first()).toHaveAttribute('aria-sort','ascending');
});
