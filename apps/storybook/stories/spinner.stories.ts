import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Spinner',
};

export default meta;

type Story = StoryObj;

export const Sizes: Story = {
  render: () => `
    <div style="display:flex; gap:16px; align-items:center;">
      <iv-spinner size="sm"></iv-spinner>
      <iv-spinner size="md"></iv-spinner>
      <iv-spinner size="lg"></iv-spinner>
    </div>
  `,
};

export const WithLabelV2: Story = {
  render: () => '<iv-spinner version="v2" label="Cargando datos"></iv-spinner>',
};
