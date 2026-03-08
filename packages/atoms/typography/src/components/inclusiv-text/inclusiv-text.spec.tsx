import { newSpecPage } from '@stencil/core/testing';
import { InclusivText } from './inclusiv-text';

describe('iv-text', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [InclusivText],
      html: '<iv-text>Texto</iv-text>',
    });

    expect(page.root).toBeTruthy();
  });
});
