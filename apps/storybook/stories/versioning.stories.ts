import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Guides/Component Versioning',
  parameters: {
    docs: {
      description: {
        component:
          'Guia practica para implementar v2 sin cambiar tag, y luego convertirlo en release mayor por paquete.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const Strategy: Story = {
  render: () => `
    <section style="font-family: ui-sans-serif, system-ui; max-width: 760px; line-height: 1.5;">
      <h2>Como versionar sin cambiar el tag</h2>
      <ol>
        <li>El componente mantiene el mismo tag publico: <code>iv-button</code> / <code>iv-input</code>.</li>
        <li>Durante migracion, se soportan dos contratos con <code>version=\"v1\" | \"v2\"</code>.</li>
        <li>Cuando v2 queda estable, se publica <strong>major</strong> del paquete y se elimina v1 internamente.</li>
      </ol>

      <h3>Publicacion recomendada</h3>
      <pre style="background:#0f172a; color:#e2e8f0; padding:12px; border-radius:8px; overflow:auto;">
npm i @inclusiv-ds/button@2
npm i @inclusiv-ds/input@1
      </pre>

      <p>
        Asi puedes tener Button en v2 e Input en v1 dentro del mismo proyecto, sin tags diferentes.
      </p>
    </section>
  `,
};
