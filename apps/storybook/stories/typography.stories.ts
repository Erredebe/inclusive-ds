import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Typography',
};

export default meta;

type Story = StoryObj;

export const Heading: Story = {
  render: () => '<iv-heading level="h2">Titular de ejemplo</iv-heading>',
};

export const TextVariants: Story = {
  render: () => `
    <div style="display:grid; gap:8px;">
      <iv-text variant="body">Texto body para contenido principal.</iv-text>
      <iv-text variant="caption" color="muted">Texto caption para notas secundarias.</iv-text>
      <iv-text variant="overline" color="primary">Categoria</iv-text>
    </div>
  `,
};

export const Label: Story = {
  render: () => '<iv-label required>Correo electronico</iv-label>',
};
