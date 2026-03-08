import { newSpecPage } from '@stencil/core/testing';
import { InclusivFormField } from './inclusiv-form-field';

describe('iv-form-field', () => {
  it('renders label', async () => {
    const page = await newSpecPage({
      components: [InclusivFormField],
      html: '<iv-form-field label="Correo"></iv-form-field>',
    });

    const label = page.root?.shadowRoot?.querySelector('.form-field__label');
    expect(label?.textContent?.trim()).toBe('Correo');
  });

  it('links helper text and invalid state to slotted control', async () => {
    const page = await newSpecPage({
      components: [InclusivFormField],
      html: '<iv-form-field id="field" error-text="Formato invalido"><input /></iv-form-field>',
    });

    await page.waitForChanges();

    const input = page.root?.querySelector('input');
    const helper = page.root?.shadowRoot?.querySelector('.form-field__helper');

    expect(input?.getAttribute('id')).toBe('field-control');
    expect(input?.getAttribute('aria-describedby')).toBe('field-helper');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
    expect(helper?.getAttribute('id')).toBe('field-helper');
  });
});
