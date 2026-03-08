import '@inclusiv-ds/tokens/src/tokens.css';
import { defineCustomElement as defineIvButton } from '@inclusiv-ds/button/components/iv-button';
import { defineCustomElement as defineIvInput } from '@inclusiv-ds/input/components/iv-input';

if (!customElements.get('iv-button')) {
  defineIvButton();
}

if (!customElements.get('iv-input')) {
  defineIvInput();
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
