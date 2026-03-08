import '@inclusiv-ds/tokens/src/tokens.css';
import { defineCustomElements as defineButton } from '@inclusiv-ds/button/loader';
import { defineCustomElements as defineInput } from '@inclusiv-ds/input/loader';

defineButton();
defineInput();

const preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
};

export default preview;
