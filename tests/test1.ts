import { Page } from 'playwright';

export async function testDickBlick(page: Page) {
  console.log('Test1: Navigating to DickBlick...');
  await page.goto('https://www.dickblick.com/', { timeout: 30000 });
  console.log('Test1: Page loaded successfully');
}
