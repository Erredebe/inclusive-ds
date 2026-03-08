import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'ivbutton',
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
