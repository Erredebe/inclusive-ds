import { newSpecPage } from '@stencil/core/testing';
import { InclusivCheckbox } from './inclusiv-checkbox';

describe('iv-checkbox', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [InclusivCheckbox],
      html: '<iv-checkbox label="Aceptar"></iv-checkbox>',
    });

    expect(page.root).toBeTruthy();
  });
});
