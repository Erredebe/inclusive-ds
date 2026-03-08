import { newSpecPage } from '@stencil/core/testing';
import { InclusivSelect } from './inclusiv-select';

describe('iv-select', () => {
  it('renders v1 by default', async () => {
    const page = await newSpecPage({
      components: [InclusivSelect],
      html: '<iv-select></iv-select>',
    });

    const select = page.root?.shadowRoot?.querySelector('select');
    expect(select).toBeTruthy();
  });

  it('renders v2 with label and helper text', async () => {
    const page = await newSpecPage({
      components: [InclusivSelect],
      html: '<iv-select version="v2" label="Pais" helper-text="Selecciona uno"></iv-select>',
    });

    const label = page.root?.shadowRoot?.querySelector('.field__label');
    const helper = page.root?.shadowRoot?.querySelector('.field__helper');
    expect(label?.textContent).toBe('Pais');
    expect(helper?.textContent).toBe('Selecciona uno');
  });

  it('emits ivChange with selected value', async () => {
    const page = await newSpecPage({
      components: [InclusivSelect],
      html: `
        <iv-select>
          <option value="">Selecciona</option>
          <option value="ar">Argentina</option>
        </iv-select>
      `,
    });

    const spy = jest.fn();
    page.root?.addEventListener('ivChange', spy);

    const select = page.root?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    select.value = 'ar';
    select.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ detail: { value: 'ar' } }));
    expect(page.root?.value).toBe('ar');
  });
});
