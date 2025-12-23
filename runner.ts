import {
  chromium,
  webkit,
  _android,
  type Browser,
  type BrowserContext,
  type Page,
  type AndroidDevice,
} from 'playwright';
import { DEVICE_CAPABILITIES, TargetPlatform } from './config/devices';
import fs from 'fs';
import path from 'path';

const TARGET = (process.env.TARGET as TargetPlatform) || 'ios';
const TEST_FILE = process.env.TEST_FILE;

(async () => {
  console.log('Starting Playwright Test...');
  console.log(`Target Platform: ${TARGET.toUpperCase()}`);
  if (TEST_FILE) console.log(`Running single test: ${TEST_FILE}`);

  const capabilities = DEVICE_CAPABILITIES[TARGET];
  if (!capabilities) throw new Error(`Unsupported TARGET: ${TARGET}`);

  const wsEndpoint = `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
    JSON.stringify(capabilities)
  )}`;

  let browser: Browser | undefined;
  let context: BrowserContext;
  let page: Page;

  if (TARGET === 'ios') {
    browser = await webkit.connect(wsEndpoint);
    context = await browser.newContext({ isMobile: true, hasTouch: true });
    page = await context.newPage();
  } else if (TARGET === 'android') {
    const device: AndroidDevice = await _android.connect(wsEndpoint);
    console.log('Connected to Android device!');
    await device.shell('am force-stop com.android.chrome');
    context = await device.launchBrowser();
    page = await context.newPage();
  } else {
    browser = await chromium.connect(wsEndpoint);
    context = await browser.newContext({ isMobile: false, hasTouch: false });
    page = await context.newPage();
  }

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

      console.log(`\nRunning ${file}...`);
      await testFunc(page);

      await page.evaluate(
        (_) => {},
        `lambdatest_action: ${JSON.stringify({
          action: 'setTestStatus',
          arguments: { status: 'passed', remark: `${file} passed` },
        })}`
      );
    } catch (err: any) {
      console.log(`${file} FAILED:`, err.message);
      await page.evaluate(
        (_) => {},
        `lambdatest_action: ${JSON.stringify({
          action: 'setTestStatus',
          arguments: { status: 'failed', remark: err.message },
        })}`
      );
    }
  }

  await page.close();
  await context.close();
  if (browser) await browser.close();
  if (TARGET === 'android') {
    await (context as any).device?.close?.();
  }

  console.log(`${TARGET.toUpperCase()} tests completed!`);
  process.exit(0);
})();
