import '@inclusiv-ds/tokens/src/tokens.css';
import { defineCustomElement as defineIvButton } from '@inclusiv-ds/button/components/iv-button';
import { defineCustomElement as defineIvInput } from '@inclusiv-ds/input/components/iv-input';
import { defineCustomElement as defineIvBadge } from '@inclusiv-ds/badge/components/iv-badge';
import { defineCustomElement as defineIvSpinner } from '@inclusiv-ds/spinner/components/iv-spinner';
import { defineCustomElement as defineIvText } from '@inclusiv-ds/typography/components/iv-text';
import { defineCustomElement as defineIvLabel } from '@inclusiv-ds/typography/components/iv-label';
import { defineCustomElement as defineIvHeading } from '@inclusiv-ds/typography/components/iv-heading';
import { defineCustomElement as defineIvCheckbox } from '@inclusiv-ds/checkbox/components/iv-checkbox';
import { defineCustomElement as defineIvRadio } from '@inclusiv-ds/radio/components/iv-radio';
import { defineCustomElement as defineIvRadioGroup } from '@inclusiv-ds/radio/components/iv-radio-group';
import { defineCustomElement as defineIvToggle } from '@inclusiv-ds/toggle/components/iv-toggle';
import { defineCustomElement as defineIvFormField } from '@inclusiv-ds/form-field/components/iv-form-field';

if (!customElements.get('iv-button')) {
  defineIvButton();
}

if (!customElements.get('iv-input')) {
  defineIvInput();
}

if (!customElements.get('iv-badge')) {
  defineIvBadge();
}

if (!customElements.get('iv-spinner')) {
  defineIvSpinner();
}

if (!customElements.get('iv-text')) {
  defineIvText();
}

if (!customElements.get('iv-label')) {
  defineIvLabel();
}

if (!customElements.get('iv-heading')) {
  defineIvHeading();
}

if (!customElements.get('iv-checkbox')) {
  defineIvCheckbox();
}

if (!customElements.get('iv-radio')) {
  defineIvRadio();
}

if (!customElements.get('iv-radio-group')) {
  defineIvRadioGroup();
}

if (!customElements.get('iv-toggle')) {
  defineIvToggle();
}

if (!customElements.get('iv-form-field')) {
  defineIvFormField();
}

const preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
  },
};

export default preview;
