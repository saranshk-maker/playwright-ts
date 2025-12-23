import { chromium, webkit, firefox, type Browser, type BrowserContext, type Page } from 'playwright';
import fs from 'fs';
import path from 'path';

const BROWSER = process.env.BROWSER || 'chromium';
const TEST_FILE = process.env.TEST_FILE;

(async () => {
  console.log(`Starting Local Playwright Test on ${BROWSER.toUpperCase()}...`);

  let browser: Browser;
  if (BROWSER === 'chromium') browser = await chromium.launch({ headless: false });
  else if (BROWSER === 'firefox') browser = await firefox.launch({ headless: false });
  else if (BROWSER === 'webkit') browser = await webkit.launch({ headless: false });
  else throw new Error(`Unsupported browser: ${BROWSER}`);

  const context: BrowserContext = await browser.newContext();
  const page: Page = await context.newPage();

  const testsDir = path.join(__dirname, 'tests');
  let testFiles = fs
    .readdirSync(testsDir)
    .filter((f) => f.endsWith('.ts'));

  if (TEST_FILE) {
    testFiles = testFiles.filter((f) => f === TEST_FILE);
    if (testFiles.length === 0) {
      console.log(`Test file ${TEST_FILE} not found in tests/`);
      process.exit(1);
    }
  }

  for (const file of testFiles) {
    try {
      const testModule = await import(path.join(testsDir, file));
      const testFuncName = Object.keys(testModule)[0];
      const testFunc = testModule[testFuncName];

      console.log(`\nRunning ${file} locally...`);
      await testFunc(page);
      console.log(`${file} PASSED locally!`);
    } catch (err: any) {
      console.log(`${file} FAILED locally:`, err.message);
    }
  }

  await page.close();
  await context.close();
  await browser.close();

  console.log(`All local tests on ${BROWSER.toUpperCase()} completed!`);
})();
