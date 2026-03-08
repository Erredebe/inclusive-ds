import { newSpecPage } from '@stencil/core/testing';
import { InclusivRadio } from './inclusiv-radio';

describe('iv-radio', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [InclusivRadio],
      html: '<iv-radio name="size" value="m" label="Medio"></iv-radio>',
    });

    expect(page.root).toBeTruthy();
  });
});
