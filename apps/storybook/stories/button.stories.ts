import type { Meta, StoryObj } from '@storybook/web-components-vite';

const meta: Meta = {
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component:
          'Mismo tag (`iv-button`) con dos contratos visuales. `version="v1"` mantiene API actual, `version="v2"` habilita la nueva API y el evento `ivClick` para callbacks.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const V1Primary: Story = {
  render: () => '<iv-button variant="primary">Guardar</iv-button>',
};

export const V1Ghost: Story = {
  render: () => '<iv-button variant="ghost">Cancelar</iv-button>',
};

export const V2Solid: Story = {
  render: () => '<iv-button version="v2" appearance="solid" size="md">Continuar</iv-button>',
};

export const V2Danger: Story = {
  render: () => '<iv-button version="v2" appearance="danger" size="lg">Eliminar</iv-button>',
};

export const V2Tertiary: Story = {
  render: () => '<iv-button version="v2" appearance="tertiary">Mas tarde</iv-button>',
};

export const V2Link: Story = {
  render: () => '<iv-button version="v2" appearance="link">Ver detalle</iv-button>',
};

export const V2Loading: Story = {
  render: () => '<iv-button version="v2" loading>Guardando</iv-button>',
};

export const V2IconOnly: Story = {
  render: () => '<iv-button version="v2" icon-only aria-label="Cerrar">x</iv-button>',
};

export const V2FullWidth: Story = {
  render: () =>
    '<div style="width:280px;"><iv-button version="v2" full-width>Continuar</iv-button></div>',
};

export const CallbackSimple: Story = {
  render: () => {
    let clicks = 0;

    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '10px';
    wrap.style.minWidth = '300px';

    const button = document.createElement('iv-button');
    button.setAttribute('version', 'v2');
    button.textContent = 'Sumar click';

    const output = document.createElement('iv-text');
    output.setAttribute('variant', 'body');
    output.textContent = 'Clicks: 0';

    button.addEventListener('ivClick', () => {
      clicks += 1;
      output.textContent = `Clicks: ${clicks}`;
    });

    wrap.append(button, output);
    return wrap;
  },
};

export const CallbackComplex: Story = {
  render: () => {
    let requests = 0;

    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';
    wrap.style.minWidth = '320px';

    const actions = document.createElement('div');
    actions.style.display = 'flex';
    actions.style.gap = '8px';

    const submit = document.createElement('iv-button');
    submit.setAttribute('version', 'v2');
    submit.setAttribute('appearance', 'solid');
    submit.textContent = 'Enviar solicitud';

    const reset = document.createElement('iv-button');
    reset.setAttribute('version', 'v2');
    reset.setAttribute('appearance', 'outline');
    reset.textContent = 'Reset';

    const status = document.createElement('iv-text');
    status.setAttribute('variant', 'body');
    status.setAttribute('color', 'muted');
    status.textContent = 'Estado: listo';

    submit.addEventListener('ivClick', () => {
      if (submit.hasAttribute('loading')) return;

      requests += 1;
      submit.setAttribute('loading', '');
      status.textContent = `Estado: procesando solicitud #${requests}...`;

      window.setTimeout(() => {
        const isError = requests % 3 === 0;
        submit.removeAttribute('loading');
        status.textContent = isError
          ? `Estado: error en solicitud #${requests}. Reintenta.`
          : `Estado: solicitud #${requests} completada.`;
      }, 900);
    });

    reset.addEventListener('ivClick', () => {
      requests = 0;
      submit.removeAttribute('loading');
      status.textContent = 'Estado: listo';
    });

    actions.append(submit, reset);
    wrap.append(actions, status);
    return wrap;
  },
};
