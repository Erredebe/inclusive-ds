import { newSpecPage } from '@stencil/core/testing';
import { InclusivFormField } from './inclusiv-form-field';

describe('iv-form-field', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [InclusivFormField],
      html: '<iv-form-field label="Correo"></iv-form-field>',
    });

    expect(page.root).toBeTruthy();
  });
});
