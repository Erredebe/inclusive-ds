import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ivinput',
  srcDir: 'src',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'www',
      serviceWorker: null,
    },
  ],
};
