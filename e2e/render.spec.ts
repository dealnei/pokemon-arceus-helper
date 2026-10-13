import {test,expect} from '@playwright/test';

test('Pokédex renders and Team Lab can navigate back',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await expect(page.locator('.app-shell')).toBeVisible();
 await expect(page.locator('.pokedex-table tbody tr')).toHaveCount(242);
 await expect(page.getByRole('button',{name:'Back to Pokédex'})).toBeVisible();
 await page.getByRole('button',{name:/Team Lab/}).click();
 await expect(page.getByRole('heading',{name:'Build a better six.'})).toBeVisible();
 await page.getByRole('button',{name:'Back to Pokédex'}).click();
 await expect(page.locator('.pokedex-table tbody tr')).toHaveCount(242);
 await page.getByRole('button',{name:/Team Lab/}).click();
 await page.getByRole('button',{name:'Return to Hisui Pokédex'}).click();
 await expect(page.locator('.pokedex-table tbody tr')).toHaveCount(242);
 expect(errors).toEqual([]);
});

test('Mobile Pokémon details open and scroll',async({browser})=>{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:4173/');
 await expect(page.locator('.pokedex-table tbody tr')).toHaveCount(242);
 await page.locator('.pokedex-table tbody tr').first().click();
 await expect(page.getByRole('dialog')).toBeVisible();
 await expect(page.getByRole('dialog').locator('.details-art h2')).toHaveText('Rowlet');
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toBeHidden();
 expect(errors).toEqual([]);
 await page.close();
});
