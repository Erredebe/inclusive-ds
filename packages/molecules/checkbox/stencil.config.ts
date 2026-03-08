import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'inclusiv-checkbox',
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader' },
    { type: 'dist-custom-elements' },
    { type: 'docs-readme' },
    { type: 'www', serviceWorker: null },
  ],
  testing: { browserHeadless: 'shell' },
};
