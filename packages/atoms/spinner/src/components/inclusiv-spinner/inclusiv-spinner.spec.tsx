import { newSpecPage } from '@stencil/core/testing';
import { InclusivSpinner } from './inclusiv-spinner';

describe('iv-spinner', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [InclusivSpinner],
      html: '<iv-spinner></iv-spinner>',
    });

    expect(page.root).toBeTruthy();
  });
});
