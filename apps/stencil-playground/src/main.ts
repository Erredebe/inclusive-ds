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
import { defineCustomElement as defineIvDialog } from '@inclusiv-ds/dialog/components/iv-dialog';
import { defineCustomElement as defineIvContainer } from '@inclusiv-ds/container/components/iv-container';

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

if (!customElements.get('iv-dialog')) {
  defineIvDialog();
}

if (!customElements.get('iv-container')) {
  defineIvContainer();
}

const style = document.createElement('style');
style.textContent = `
  :root {
    font-family: Inter, Segoe UI, Arial, sans-serif;
  }

  body {
    margin: 0;
    background: #f5faf9;
    color: #0b1f1d;
  }

  .layout {
    max-width: 980px;
    margin: 0 auto;
    padding: 24px;
    display: grid;
    gap: 16px;
  }

  .card {
    background: #fff;
    border: 1px solid #d9ece8;
    border-radius: 12px;
    padding: 16px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }

  .col {
    display: grid;
    gap: 12px;
    max-width: 380px;
  }
`;
document.head.appendChild(style);
