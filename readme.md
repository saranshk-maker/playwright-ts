# Playwright Multi-Platform Tests

Automated Playwright tests for **iOS, Android (LambdaTest real devices)**, and **local desktop browsers** (Chromium, Firefox, WebKit).

This project allows you to run tests on real mobile devices via LambdaTest and also on your local desktop.

---

## Pre-requisites

1. Clone the LambdaTest-Playwright repository on your system.

2. Install the npm dependencies.
```
npm install
npx playwright install
```

3. Replace your credentials in config/lambdatest.ts file.


## Run All Your Playwright Tests (Platform Specific)
```
npm run test:ios
npm run test:android
npm run test:desktop
```

## Run Single Playwright Test (Platform Specific)
```
npm run test:ios:test1
npm run test:android:test1
npm run test:desktop:test1
```

## Run all local tests (Platform Specific)
```
npm run test:local:chromium
npm run test:local:firefox
npm run test:local:webkit
```

## Run a single local test module (Platform Specific)
```
npm run test:local:chromium:test1
npm run test:local:firefox:test1
npm run test:local:webkit:test1
```

## Create a Test Module
Add test files in the tests/ folder. Each test should export an async function that receives a Playwright Page object.

```
// tests/test1.ts
import { Page } from 'playwright';

export async function test1(page: Page) {
  await page.goto('https://www.lambdatest.com/');
  console.log('test1 completed');
}
```