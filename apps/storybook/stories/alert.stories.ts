import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Feedback/Alert',
  parameters: {
    docs: {
      description: {
        component:
          'Mensajes persistentes dentro de la interfaz para informar estado, exito, advertencia o error.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Info: Story = {
  render: () =>
    '<iv-alert appearance="info" title="Info" description="Tu sesion permanece activa."></iv-alert>',
};

export const Success: Story = {
  render: () =>
    '<iv-alert appearance="success" title="Guardado" description="Los cambios se guardaron correctamente."></iv-alert>',
};

export const WarningClosable: Story = {
  render: () =>
    '<iv-alert appearance="warning" title="Atencion" description="Revisa los datos antes de continuar." closable></iv-alert>',
};

export const Error: Story = {
  render: () =>
    '<iv-alert appearance="error" title="Error" description="No se pudo completar la operacion."></iv-alert>',
};
