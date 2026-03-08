import { newSpecPage } from '@stencil/core/testing';
import { InclusivRadio } from './inclusiv-radio';

describe('iv-radio', () => {
  it('renders label', async () => {
    const page = await newSpecPage({
      components: [InclusivRadio],
      html: '<iv-radio name="size" value="m" label="Medio"></iv-radio>',
    });

    const label = page.root?.shadowRoot?.querySelector('.radio__label');
    expect(label?.textContent).toBe('Medio');
  });

  it('emits legacy and normalized events when checked', async () => {
    const page = await newSpecPage({
      components: [InclusivRadio],
      html: '<iv-radio name="size" value="m"></iv-radio>',
    });

    let radioChangeDetail: string | undefined;
    let ivChangeDetail: { value: string } | undefined;

    page.root?.addEventListener('radioChange', ((event: CustomEvent<string>) => {
      radioChangeDetail = event.detail;
    }) as EventListener);
    page.root?.addEventListener('ivChange', ((event: CustomEvent<{ value: string }>) => {
      ivChangeDetail = event.detail;
    }) as EventListener);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(radioChangeDetail).toBe('m');
    expect(ivChangeDetail).toEqual({ value: 'm' });
  });
});
