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
          <input class="input input--v1" placeholder="Email" type="text" value="">
        </mock:shadow-root>
      </iv-input>
    `);
  });

  it('renders v2 with label and helper binding', async () => {
    const page = await newSpecPage({
      components: [InclusivInput],
      html: '<iv-input id="email" version="v2" label="Correo" placeholder="tu@email.com" helper-text="Obligatorio"></iv-input>',
    });

    const input = page.root?.shadowRoot?.querySelector('input');
    const helper = page.root?.shadowRoot?.querySelector('.field__helper');

    expect(input?.getAttribute('id')).toBe('email');
    expect(input?.getAttribute('aria-describedby')).toBe('email-helper');
    expect(helper?.getAttribute('id')).toBe('email-helper');
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

  it('emits ivInput and ivChange events', async () => {
    const page = await newSpecPage({
      components: [InclusivInput],
      html: '<iv-input version="v2"></iv-input>',
    });

    let inputDetail: { value: string } | undefined;
    let changeDetail: { value: string } | undefined;

    page.root?.addEventListener('ivInput', ((event: CustomEvent<{ value: string }>) => {
      inputDetail = event.detail;
    }) as EventListener);
    page.root?.addEventListener('ivChange', ((event: CustomEvent<{ value: string }>) => {
      changeDetail = event.detail;
    }) as EventListener);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'abc';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(inputDetail).toEqual({ value: 'abc' });
    expect(changeDetail).toEqual({ value: 'abc' });
  });

  it('renders clear button and resets value', async () => {
    const page = await newSpecPage({
      components: [InclusivInput],
      html: '<iv-input version="v2" value="demo" clearable></iv-input>',
    });

    const clear = page.root?.shadowRoot?.querySelector('.field__clear') as HTMLButtonElement;
    expect(clear).toBeTruthy();

    clear.click();
    await page.waitForChanges();
    expect(page.root?.value).toBe('');
  });
});
