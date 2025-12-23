import { LT_CREDENTIALS, COMMON_LT_OPTIONS } from './lambdatest';

export type TargetPlatform = 'ios' | 'android' | 'desktop';

export const DEVICE_CAPABILITIES: Record<TargetPlatform, any> = {
    ios: {
        browserName: 'Safari',
        'LT:Options': {
        platformName: 'ios',
        deviceName: 'iPhone.*',
        platformVersion: '26',
        isRealMobile: true,
        name: 'iOS Safari Smoke',
        ...LT_CREDENTIALS,
        ...COMMON_LT_OPTIONS,
        },
    },

    android: {
        browserName: 'Chrome',
        'LT:Options': {
        platformName: 'Android',
        deviceName: 'Galaxy.*',
        platformVersion: '16',
        isRealMobile: true,
        name: 'Android Chrome Smoke',
        ...LT_CREDENTIALS,
        ...COMMON_LT_OPTIONS,
        },
    },

  desktop: {
        browserName: 'Chrome',
        'LT:Options': {
        platformName: 'Windows 11',
        name: 'Desktop Chrome Smoke',
        ...LT_CREDENTIALS,
        ...COMMON_LT_OPTIONS,
        },
    },
};
