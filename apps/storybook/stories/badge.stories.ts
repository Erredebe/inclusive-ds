import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Badge',
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => '<iv-badge>Default</iv-badge>',
};

export const States: Story = {
  render: () => `
    <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
      <iv-badge>Default</iv-badge>
      <iv-badge variant="success">Success</iv-badge>
      <iv-badge variant="warning">Warning</iv-badge>
      <iv-badge variant="error">Error</iv-badge>
      <iv-badge variant="info">Info</iv-badge>
    </div>
  `,
};
