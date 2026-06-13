const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/');
  await page.waitForLoadState('networkidle');
  
  const screenshot = await page.screenshot({ path: './screenshot.png', fullPage: true });
  
  const searchBox = await page.$('.search-input');
  const sortButton = await page.$('.sort-btn');
  const tagCloud = await page.$('.tag-cloud');
  const masonryGrid = await page.$('.masonry-grid');
  
  console.log('Search Box:', searchBox ? 'Found' : 'Not Found');
  console.log('Sort Button:', sortButton ? 'Found' : 'Not Found');
  console.log('Tag Cloud:', tagCloud ? 'Found' : 'Not Found');
  console.log('Masonry Grid:', masonryGrid ? 'Found' : 'Not Found');
  
  await browser.close();
})();
