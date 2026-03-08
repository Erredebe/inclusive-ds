import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Selection Controls',
};

export default meta;

type Story = StoryObj;

export const Checkbox: Story = {
  render: () => '<iv-checkbox label="Acepto terminos"></iv-checkbox>',
};

export const RadioGroup: Story = {
  render: () => `
    <iv-radio-group label="Tamano">
      <iv-radio name="size" value="s" label="Small"></iv-radio>
      <iv-radio name="size" value="m" label="Medium"></iv-radio>
      <iv-radio name="size" value="l" label="Large"></iv-radio>
    </iv-radio-group>
  `,
};

export const Toggle: Story = {
  render: () => '<iv-toggle label="Recibir notificaciones"></iv-toggle>',
};

export const FormField: Story = {
  render: () => `
    <iv-form-field label="Correo" helper-text="Usaremos este correo para contactarte" required>
      <iv-input version="v2" placeholder="tu@email.com"></iv-input>
    </iv-form-field>
  `,
};
