import { newSpecPage } from '@stencil/core/testing';
import { InclusivToggle } from './inclusiv-toggle';

describe('iv-toggle', () => {
  it('renders label', async () => {
    const page = await newSpecPage({
      components: [InclusivToggle],
      html: '<iv-toggle label="Notificaciones"></iv-toggle>',
    });

    const label = page.root?.shadowRoot?.querySelector('.toggle__label');
    expect(label?.textContent).toBe('Notificaciones');
  });

  it('emits legacy and normalized events on change', async () => {
    const page = await newSpecPage({
      components: [InclusivToggle],
      html: '<iv-toggle></iv-toggle>',
    });

    let toggleChangeDetail: boolean | undefined;
    let ivChangeDetail: { value: boolean } | undefined;

    page.root?.addEventListener('toggleChange', ((event: CustomEvent<boolean>) => {
      toggleChangeDetail = event.detail;
    }) as EventListener);
    page.root?.addEventListener('ivChange', ((event: CustomEvent<{ value: boolean }>) => {
      ivChangeDetail = event.detail;
    }) as EventListener);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(toggleChangeDetail).toBe(true);
    expect(ivChangeDetail).toEqual({ value: true });
  });
});
