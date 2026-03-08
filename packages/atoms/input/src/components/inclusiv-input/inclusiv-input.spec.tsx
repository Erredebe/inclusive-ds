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
      html: '<iv-input id="email" version="v2" label="Correo" placeholder="tu@email.com" helper-text="Obligatorio"></iv-input>',
    });

    expect(page.root).toEqualHtml(`
      <iv-input helper-text="Obligatorio" id="email" label="Correo" placeholder="tu@email.com" version="v2">
        <mock:shadow-root>
          <label class="field field--default">
            <span class="field__label">Correo</span>
            <input aria-describedby="email-helper" class="field__input" id="email" placeholder="tu@email.com">
            <span class="field__helper" id="email-helper">Obligatorio</span>
          </label>
        </mock:shadow-root>
      </iv-input>
    `);
  });

  it('sets aria-invalid when state is error in v2', async () => {
    const page = await newSpecPage({
      components: [InclusivInput],
      html: '<iv-input id="error-input" version="v2" state="error" helper-text="Invalido"></iv-input>',
    });

    const input = page.root?.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(input?.getAttribute('aria-describedby')).toBe('error-input-helper');
  });
});
