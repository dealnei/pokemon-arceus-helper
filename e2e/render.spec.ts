import {test,expect} from '@playwright/test';

test('Pokédex renders and Team Lab can navigate back',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('/');
 await expect(page.locator('.app-shell')).toBeVisible();
 await expect(page.locator('.pokedex-table tbody tr')).toHaveCount(242);
 await expect(page.getByRole('button',{name:'Back to Pokédex'})).toBeVisible();
 await expect(page.getByRole('navigation',{name:'Main navigation'}).getByText('Export CSV')).toHaveCount(0);
 const brand=page.getByRole('button',{name:'Return to Hisui Pokédex'});
 const header=page.locator('.site-header');
 const brandBox=await brand.boundingBox();
 const headerBox=await header.boundingBox();
 expect(brandBox).toBeTruthy();
 expect(headerBox).toBeTruthy();
 expect(Math.abs((brandBox!.x+brandBox!.width/2)-(headerBox!.x+headerBox!.width/2))).toBeLessThan(2);
 const downloadPromise=page.waitForEvent('download');
 await page.getByRole('button',{name:'Download full Pokédex (.csv)'}).click();
 const download=await downloadPromise;
 expect(download.suggestedFilename()).toBe('Hisui_Pokedex_242.csv');

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

test('Header branding stays centered on mobile',async({browser})=>{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await page.goto('/');
 const brand=await page.getByRole('button',{name:'Return to Hisui Pokédex'}).boundingBox();
 const header=await page.locator('.site-header').boundingBox();
 expect(brand).toBeTruthy();
 expect(header).toBeTruthy();
 expect(Math.abs((brand!.x+brand!.width/2)-(header!.x+header!.width/2))).toBeLessThan(2);
 await expect(page.getByRole('button',{name:'Download full Pokédex (.csv)'})).toBeVisible();
 await page.close();
});

test('Single-page SEO metadata, sitemap and social image are present in the compiled site',async({request,page})=>{
 const response=await request.get('/');
 expect(response.ok()).toBe(true);
 const html=await response.text();
 expect(html).toContain('<link rel="canonical" href="https://dealnei.github.io/pokemon-arceus-helper/"/>');
 expect(html).toContain('application/ld+json');
 expect(html).toContain('242 Pokémon');
 expect(html).toContain('property="og:image"');
 expect(html).toContain('name="twitter:card"');
 expect(html).toContain('Pokémon Legends: Arceus Pokédex and Team Builder');
 const sitemap=await request.get('/sitemap.xml');
 expect(sitemap.ok()).toBe(true);
 expect(await sitemap.text()).toContain('<loc>https://dealnei.github.io/pokemon-arceus-helper/</loc>');
 const image=await request.get('/social-card.png');
 expect(image.ok()).toBe(true);
 expect(image.headers()['content-type']).toContain('image/png');
 expect((await image.body()).byteLength).toBeGreaterThan(2000);
 await page.goto('/');
 await expect(page.getByRole('heading',{level:1,name:'Pokémon Legends: Arceus Pokédex'})).toBeVisible();
 expect(await page.locator('h1').count()).toBe(1);
});

test('Pokémon acquisition places render as clickable external map list on mobile and desktop',async({page})=>{
 await page.goto('/');
 await page.locator('.pokedex-table tbody tr').first().click();
 const section=page.getByRole('region',{name:'Where to obtain'});
 await expect(section).toBeVisible();
 await expect(section.locator('.location-list li').first()).toBeVisible();
 const links=section.locator('a.location-link');
 await expect(links.first()).toHaveAttribute('href',/gamerguides\.com\/pokemon-legends-arceus\/maps\//);
 await expect(links.first()).toHaveAttribute('target','_blank');
 await expect(section).toContainText('regional maps');
 await page.setViewportSize({width:390,height:844});
 await expect(page.getByRole('dialog').getByRole('region',{name:'Where to obtain'})).toBeVisible();
});

test('Evolution steps render as a list with local targets and external guide links',async({page})=>{
 await page.goto('/');
 await page.locator('.pokedex-table tbody tr').first().click();
 const evolution=page.getByRole('region',{name:'Evolution family'});
 await expect(evolution).toBeVisible();
 await expect(evolution.locator('ol.evo-steps li')).toHaveCount(2);
 await expect(evolution.locator('ol.evo-steps li').first()).toContainText('Level 17');
 await expect(evolution.locator('ol.evo-steps li').last()).toContainText('Level 36');
 await expect(evolution.locator('a.evo-guide-link').first()).toHaveAttribute('href',/serebii\.net\/pokedex-swsh\//);
 await expect(evolution.locator('a.evo-guide-link').first()).toHaveAttribute('target','_blank');
 await evolution.getByRole('button',{name:'Dartrix',exact:true}).click();
 await expect(page.locator('.details-art h2')).toHaveText('Dartrix');
});
