import { newSpecPage } from '@stencil/core/testing';
import { InclusivCheckbox } from './inclusiv-checkbox';

describe('iv-checkbox', () => {
  it('renders label', async () => {
    const page = await newSpecPage({
      components: [InclusivCheckbox],
      html: '<iv-checkbox label="Aceptar"></iv-checkbox>',
    });

    const label = page.root?.shadowRoot?.querySelector('.checkbox__label');
    expect(label?.textContent).toBe('Aceptar');
  });

  it('emits legacy and normalized events on change', async () => {
    const page = await newSpecPage({
      components: [InclusivCheckbox],
      html: '<iv-checkbox></iv-checkbox>',
    });

    let checkedChangeDetail: boolean | undefined;
    let ivChangeDetail: { value: boolean } | undefined;

    page.root?.addEventListener('checkedChange', ((event: CustomEvent<boolean>) => {
      checkedChangeDetail = event.detail;
    }) as EventListener);
    page.root?.addEventListener('ivChange', ((event: CustomEvent<{ value: boolean }>) => {
      ivChangeDetail = event.detail;
    }) as EventListener);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(checkedChangeDetail).toBe(true);
    expect(ivChangeDetail).toEqual({ value: true });
  });
});
