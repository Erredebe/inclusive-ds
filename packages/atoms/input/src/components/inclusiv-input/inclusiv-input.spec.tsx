import { newSpecPage } from '@stencil/core/testing';

import { InclusivInput } from './inclusiv-input';

describe('iv-input', () => {
  it('renders v1 by default', async () => {
    const page = await newSpecPage({
      components: [InclusivInput],
      html: '<iv-input placeholder="Email"></iv-input>',
    });

    expect(page.root).toEqualHtml(`
      <iv-input placeholder="Email">
        <mock:shadow-root>
          <input class="input input--v1" placeholder="Email">
        </mock:shadow-root>
      </iv-input>
    `);
  });

  it('renders v2 when version is set', async () => {
    const page = await newSpecPage({
      components: [InclusivInput],
      html: '<iv-input version="v2" label="Correo" placeholder="tu@email.com" helper-text="Obligatorio"></iv-input>',
    });

    expect(page.root).toEqualHtml(`
      <iv-input helper-text="Obligatorio" label="Correo" placeholder="tu@email.com" version="v2">
        <mock:shadow-root>
          <label class="field field--default">
            <span class="field__label">Correo</span>
            <input class="field__input" placeholder="tu@email.com">
            <span class="field__helper">Obligatorio</span>
          </label>
        </mock:shadow-root>
      </iv-input>
    `);
  });
});
